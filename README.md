#QuickFeed
[![Build Status](https://travis-ci.org/MWGitHub/quickfeed.svg?branch=master)](https://travis-ci.org/MWGitHub/quickfeed)

QuickFeed is a feed displayer with performance in mind. Navigating through the site is smooth and responsive even on slower hardware.

Check out a demo at [quickfeed.mwguy.com](http://quickfeed.mwguy.com/)

###Welcome View:

![welcome]

###Installation:

Requirements for development:
Python 2.7.11
Redis
Node 6.1.0

For development:
* Clone the repository
* Inside the folder run the following commands:
* `pip install -r requirements.txt` to install the python dependencies
* `gunicorn run:app` to start the api server
* In another terminal and in the same folder run the following commands:
* `npm install` to install the js dependencies
* `npm start` to build the frontend files
* Navigate to http://localhost:8000

###Technical Details:

####Schema
The data is stored in redis with the following structures:

Item represents an item in the feed and is stored as a hash with the key item:[item_id].  
Hashes are used to allow retrieval of items from sorted sets
```
{
  id,
  created_time,
  link,
  type,
  likes,
  comments,
  caption (if exists)

  images (if exists)
  images_low_url,
  images_low_width,
  images_low_height,
  images_standard_url,
  images_standard_width,
  images_standard_height,

  videos (if exists)
  videos_low_url,
  videos_low_width,
  videos_low_height,
  videos_standard_url,
  videos_standard_width,
  videos_standard_height
}
```

Sorted items are stored as sorted sets with the key items:[type].  
Sorted sets are used due to their quick range retrieval, addition, and removal.  
The sets use the following as the score: created_time, likes, and comments.  
Having three separate sets allows for quick retrieval without having to sort on the fly each time.  
Adding is O(log(n)) and is run on all three sorted sets when an item is saved.  
Removal is also O(log(n)) and can be run when an item is deleted or if one wants to limit the number of items in the set.

####Infinite Scroll
Items are only fetched when the list is scrolled to the bottom with a buffer in an animation frame for smoother scrolling on mobile devices. This is checked with:

```
_handleAnimation() {
    if (this.shouldAnimate) {
      const hasItems = this.props.items && this.props.items.length > 0;
      // Check if the page should load more items
      if (!this.hasRunScrollLoad && hasItems) {
        const container = ReactDOM.findDOMNode(this.refs.infinite);
        let bottom = window.pageYOffset || document.documentElement.scrollTop;
        bottom += window.innerHeight;
        let elementBottom = container.offsetTop + container.offsetHeight;
        let space = elementBottom - bottom;

        if (space <= this.props.bottomOffset) {
          this.hasRunScrollLoad = true;
          this.props.onScrollLoad();
        }
      }

      // Show or hide elements
      this._checkVisiblity();

      window.requestAnimationFrame(this.handleAnimation);
    }
  }
```

When items are no longer visible the content is no longered rendered. Visibility is checked with:

```
_checkVisiblity() {
    let top = window.pageYOffset || document.documentElement.scrollTop;
    if (this.lastScroll === top) return;
    this.lastScroll = top;

    top = 0;
    let bottom = top + window.innerHeight;

    for (let key in this.renderedPieces) {
      let piece = this.renderedPieces[key];
      let bounds = piece.element.getBoundingClientRect();
      let eleTop = bounds.top;
      let eleBot = bounds.bottom;

      // Recycle element if out of range else show
      if (eleBot < top || eleTop > bottom) {
        if (piece.isVisible) {
          this._recyclePiece(piece);
        }
      } else {
        if (!piece.isVisible) {
          this._setItem(piece.item, piece);
        }
      }
    }
  }
```

###Features
* Fetches items from the Instagram API
* Quick retrieval of sorted items
* Quick addition of items that are also sorted
* Smooth infinite scrolling
* Items that are not visible do not have content rendered

###To-Do:
* [ ] Optimize memory usage


[welcome]: ./docs/images/welcome.png
