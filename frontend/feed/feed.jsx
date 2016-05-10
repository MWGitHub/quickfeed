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
      type: FeedTypeStore.getType(),
      isLoading: true
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
        this.setState({ isLoading: true });
        FeedActions.resetItems();
        setTimeout(_ => {
            ApiUtil.fetchItems({ sort: this.state.type }, _ => {
              this.setState({ isLoading: false });
            });
        }, 0);
      }, 0);
    });

    ApiUtil.fetchItems({ sort: this.state.type }, _ => {
      this.setState({ isLoading: false });
    });
  }

  componentWillUnmount() {
    this.feedToken.remove();
    this.feedTypeToken.remove();
  }

  _handleScrollLoad() {
    let meta = this.state.meta;
    this.setState({ isLoading: true });
    ApiUtil.fetchItems({ url: meta.next_url }, _ => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    let spinner = '';
    if (this.state.isLoading) {
      spinner = (
        <div className="sk-fading-circle">
          <div className="sk-circle1 sk-circle"></div>
          <div className="sk-circle2 sk-circle"></div>
          <div className="sk-circle3 sk-circle"></div>
          <div className="sk-circle4 sk-circle"></div>
          <div className="sk-circle5 sk-circle"></div>
          <div className="sk-circle6 sk-circle"></div>
          <div className="sk-circle7 sk-circle"></div>
          <div className="sk-circle8 sk-circle"></div>
          <div className="sk-circle9 sk-circle"></div>
          <div className="sk-circle10 sk-circle"></div>
          <div className="sk-circle11 sk-circle"></div>
          <div className="sk-circle12 sk-circle"></div>
        </div>
      );
    }

    return (
      <div>
        <div className="feed">
          <FeedList items={this.state.items}
            onScrollLoad={this._handleScrollLoad.bind(this)}
            />
          {spinner}
        </div>
      </div>
    )
  }
}

export default Feed;
