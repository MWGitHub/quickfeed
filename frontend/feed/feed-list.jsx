import React from 'react';
import FeedItem from './feed-item';
import Infinite from '../infinite/infinite';

class FeedList extends React.Component {
  constructor(props) {
    super(props);
  }

  _calculateHeights() {
    // Create an element outside the screen matching the feed item
    let body = document.getElementsByTagName('body')[0];
    let container = document.createElement('div');
    body.appendChild(container);

    let caption = document.createElement('p');
    container.appendChild(caption);

    let line = document.createElement('p');
    line.innerHTML = '0';
    container.appendChild(line);
    line = document.createElement('p');
    line.innerHTML = '0';
    container.appendChild(line);

    let content = document.createElement('div');
    container.appendChild(content);


    let heights = [];
    for (let i = 0; i < this.props.items.length; ++i) {
      let item = this.props.items[i];
      let height = 0;

      caption.innerHTML = item.caption;

      content.style.width = '1px';
      content.style.height = (4 + parseInt(item.images_standard_height)) + 'px';

      height = container.getBoundingClientRect().height;
      heights.push(height);
    }

    return heights;
  }

  _handleSetBlueprint(item, element) {
    if (element) {
      element.properties.content.style.height = item.images_standard_height;
      return element;
    } else {
      let container = document.createElement('div');

      let caption = document.createElement('p');
      container.appendChild(caption);

      let line = document.createElement('p');
      line.innerHTML = '0';
      container.appendChild(line);
      line = document.createElement('p');
      line.innerHTML = '0';
      container.appendChild(line);

      let imageWrapper = document.createElement('p');
      container.appendChild(imageWrapper);
      let content = document.createElement('img');
      imageWrapper.appendChild(content);

      return {
        element: container,
        properties: {
          content: content
        }
      };
    }
  }

  _handleSetItem(item, element) {
    if (element) {
      const properties = element.properties;
      properties.caption.innerHTML = item.caption;
      properties.comments.innerHTML = item.comments + ' Comments';
      properties.likes.innerHTML = item.likes + ' Likes';
      properties.content.setAttribute('src', item.images_standard_url);

      return element;
    } else {
      let container = document.createElement('div');

      let caption = document.createElement('p');
      caption.innerHTML = item.caption;
      container.appendChild(caption);

      let comments = document.createElement('p');
      comments.innerHTML = item.comments + ' Comments';
      container.appendChild(comments);
      let likes = document.createElement('p');
      likes.innerHTML = item.likes + ' Likes';
      container.appendChild(likes);

      let imageWrapper = document.createElement('p');
      container.appendChild(imageWrapper);
      let content = document.createElement('img');
      content.setAttribute('src', item.images_standard_url);
      imageWrapper.appendChild(content);

      return {
        element: container,
        properties: {
          caption: caption,
          comments: comments,
          likes: likes,
          content: content
        }
      };
    }
  }

  render() {
    // Show loading page when nothing is loaded
    if (!this.props.items || this.props.items.length === 0) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div>
        <Infinite items={this.props.items} onScroll={this.props.onInfiniteLoad}
          setBlueprint={this._handleSetBlueprint}
          setItem={this._handleSetItem}
          onScrollLoad={this.props.onScrollLoad}
          />
      </div>
    );
  }
}

export default FeedList;
