import React from 'react';
import FeedItem from './feed-item';
import Infinite from '../infinite/infinite';
import moment from 'moment';
import APIUtil from '../util/api-util';

const IMAGE_TYPE = 'image';
const VIDEO_TYPE = 'video';

class FeedList extends React.Component {
  constructor(props) {
    super(props);
  }

  _parseString(string) {
    let output = '';
    output = string.replace(/(#[^#@ ]+)/g, match => {
      const tag = match.substr(1);
      return `<a href="https://www.instagram.com/explore/tags/${tag}/">${match}</a>`;
    });

    output = output.replace(/(@[^#@ ]+)/g, match => {
      const tag = match.substr(1);
      return `<a href="https://www.instagram.com/${tag}/">${match}</a>`;
    });
    return output;
  }

  _onPin(item, piece) {
    return function(e) {
      let state = item.pinned === 'False' ? 'True' : 'False';
      APIUtil.pinItem(item.id, state, _ => {
        // Update pin class
        if (item.pinned === 'False') {
          piece.properties.pin.className = 'item-pin item-pin-pinned';
        } else {
          piece.properties.pin.className = 'item-pin item-pin-unpinned';
        }
        item.pinned = state;
      });
    }
  }

  _setItemProperties(item, piece, isDummy=false) {
    const properties = piece.properties;
    if (isDummy) {
      properties.caption.innerHTML = item.caption;
    } else {
      properties.caption.innerHTML = this._parseString(item.caption);
    }
    properties.comments.innerHTML = item.comments + ' comments';
    properties.likes.innerHTML = item.likes + ' likes';
    properties.time.innerHTML = moment.unix(parseInt(item.created_time)).fromNow();
    // Erase the content if it is a dummy
    let ratio = 1;
    let height = 1;
    if (item.type === VIDEO_TYPE) {
      ratio = 500 / parseInt(item.videos_standard_width);
      height = parseInt(item.videos_standard_height);
    } else {
      ratio = 500 / parseInt(item.images_standard_width);
      height = parseInt(item.images_standard_height);
    }
    if (isDummy) {
      properties.content.setAttribute('src', '');
      // Remove pin callback also
      properties.pin.removeEventListener('click', properties.pin._listener);
    } else {
      if (item.type === VIDEO_TYPE) {
        properties.content.setAttribute('src', item.videos_standard_url);
      } else {
        properties.content.setAttribute('src', item.images_standard_url);
      }
      // Update pin class
      if (item.pinned === 'True') {
        properties.pin.className = 'item-pin item-pin-pinned';
      } else {
        properties.pin.className = 'item-pin item-pin-unpinned';
      }
      properties.pin._listener = this._onPin(item, piece);
      properties.pin.addEventListener('click', properties.pin._listener);
    }
    properties.content.style['max-width'] = '500px';
    properties.content.style.height = (height * ratio) + 'px';
  }

  /**
   * Sets a piece's properties or creates a new one.
   * @param  {Object}  item    the item to use the properties of.
   * @param  {Object=} piece   the piece to update, create new if none given.
   * @param  {boolean} isDummy true to render a dummy item.
   * @return {Object}          the updated or created piece.
   */
  _handleSetItem(item, piece, isDummy=false) {
    if (piece) {
      this._setItemProperties(item, piece, isDummy);

      return piece;
    } else {
      let container = document.createElement('div');
      container.className = 'item';

      let caption = document.createElement('p');
      caption.className = 'item-caption';
      caption.innerHTML = this._parseString(item.caption);
      container.appendChild(caption);

      let contentWrapper = document.createElement('p');
      contentWrapper.className = 'item-content-wrapper';
      container.appendChild(contentWrapper);
      let content = null;
      if (item.type === VIDEO_TYPE) {
        content = document.createElement('video');
        content.setAttribute('src', item.videos_standard_url);
        content.setAttribute('controls', '');
      } else {
        content = document.createElement('img');
        content.setAttribute('src', item.images_standard_url);
      }
      content.className = 'item-content';
      contentWrapper.appendChild(content);


      let statsWrapper = document.createElement('div');
      statsWrapper.className = 'item-stats group';
      container.appendChild(statsWrapper);
      let statsLeft = document.createElement('div');
      statsLeft.className = 'item-stats-left group';
      statsWrapper.appendChild(statsLeft);
      let statsRight = document.createElement('div');
      statsRight.className = 'item-stats-right group';
      statsWrapper.appendChild(statsRight);

      let comments = document.createElement('p');
      comments.innerHTML = item.comments + ' comments';
      statsLeft.appendChild(comments);
      let spacer = document.createElement('p');
      spacer.innerHTML = '&middot;';
      statsLeft.appendChild(spacer);
      let likes = document.createElement('p');
      likes.innerHTML = item.likes + ' likes';
      statsLeft.appendChild(likes);
      spacer = document.createElement('p');
      spacer.innerHTML = '&middot;';
      statsLeft.appendChild(spacer);
      let time = document.createElement('p');
      time.innerHTML = moment.unix(parseInt(item.created_time)).fromNow();
      statsLeft.appendChild(time);
      // Create the pin icon
      let pin = document.createElement('div');
      pin.className = 'item-pin';
      statsRight.appendChild(pin);

      let newPiece = {
        element: container,
        properties: {
          caption: caption,
          comments: comments,
          likes: likes,
          time: time,
          content: content,
          pin: pin
        }
      };

      this._setItemProperties(item, newPiece, isDummy);

      return newPiece;
    }
  }

  render() {
    // Show loading spinner when nothing is loaded
    if (!this.props.items || this.props.items.length === 0) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div>
        <Infinite items={this.props.items} onScroll={this.props.onInfiniteLoad}
          setItem={this._handleSetItem.bind(this)}
          onScrollLoad={this.props.onScrollLoad}
          />
      </div>
    );
  }
}

export default FeedList;
