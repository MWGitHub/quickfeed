import React from 'react';

class FeedItem extends React.Component {
  render() {
    return (
      <div className="item">
        <p>{this.props.item.caption}</p>
        <p>{this.props.item.comments} Comments</p>
        <p>{this.props.item.likes} Likes</p>
        <p>
          <img src={this.props.item.images_standard_url} />
        </p>
      </div>
    );
  }
}

export default FeedItem;
