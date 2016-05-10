import React from 'react';
import ApiUtil from '../util/api-util';
import FeedStore from './store';
import FeedTypeStore from './feed-type-store';
import FeedList from './feed-list';
import FeedActions from './actions';

class Feed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: FeedStore.all(),
      meta: FeedStore.getMeta(),
      type: FeedTypeStore.getType()
    };
  }

  componentDidMount() {
    this.feedToken = FeedStore.addListener(_ => {
      this.setState({
        items: FeedStore.all(),
        meta: FeedStore.getMeta()
      });
    });

    this.feedTypeToken = FeedTypeStore.addListener(_ => {
      this.setState({
        type: FeedTypeStore.getType()
      });
      setTimeout(_ => {
        FeedActions.resetItems();
        setTimeout(_ => {
          ApiUtil.fetchItems({ sort: this.state.type });
        }, 0);
      }, 0);
    });
    ApiUtil.fetchItems({ sort: this.state.type });
  }

  componentWillUnmount() {
    this.feedToken.remove();
    this.feedTypeToken.remove();
  }

  _handleScrollLoad() {
    let meta = this.state.meta;
    ApiUtil.fetchItems({ url: meta.next_url });
  }

  render() {
    return (
      <div>
        <div className="feed">
          <FeedList items={this.state.items}
            onScrollLoad={this._handleScrollLoad.bind(this)}
            />
        </div>
      </div>
    )
  }
}

export default Feed;
