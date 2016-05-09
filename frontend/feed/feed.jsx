import React from 'react';
import ApiUtil from '../util/api-util';
import FeedStore from './store';
import FeedList from './feed-list';

class Feed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: FeedStore.all(),
      meta: FeedStore.getMeta()
    };
  }

  componentDidMount() {
    this.feedToken = FeedStore.addListener(_ => {
      this.setState({
        items: FeedStore.all(),
        meta: FeedStore.getMeta()
      });
    });
    ApiUtil.fetchItems();
  }

  componentWillUnmount() {
    this.feedToken.remove();
  }

  _handleScrollLoad() {
    console.log('inf');
    let meta = this.state.meta;
    ApiUtil.fetchItems({ url: meta.next_url });
  }

  render() {
    return (
      <div>
        <FeedList items={this.state.items}
          onScrollLoad={this._handleScrollLoad.bind(this)}
        />
      </div>
    )
  }
}

export default Feed;
