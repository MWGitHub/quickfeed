#QuickFeed
[![Build Status](https://travis-ci.org/MWGitHub/quickfeed.svg?branch=master)](https://travis-ci.org/MWGitHub/quickfeed)

QuickFeed is a feed displayer with performance in mind. Navigating through the site is smooth and responsive even on slower hardware.

Check out a demo at [www.example.com](https://www.example.com/)

###Welcome View:

![welcome]

###Feed View:

![feed]

###Usage:

Add usage instructions here

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


Add specific technical details for the code here.

```
put code here
```

###Features
* Fetches items from the Instagram API
* Quick retrieval of sorted items
* Quick addition of items that are also sorted

###To-Do:
* [ ] Add more To-Dos here


[welcome]: ./docs/images/welcome.png
[feed]: ./docs/images/feed.png
