import request from 'reqwest';
import co from 'co';
import FeedActions from '../feed/actions';

export default {
  fetchItems: function (options, callback) {
    // Set default options
    let opts = Object.assign({
      sort: 'default',
      start: 0,
      count: 10
    }, options);

    // Set data if no default url given
    let url = opts.url || '/api/feed';
    let data = null;
    if (!opts.url) {
      data = {
        sort: opts.sort,
        start: opts.start,
        count: opts.count
      };
    }

    return co(function* () {
      let req = yield request({
        url: url,
        method: 'get',
        data: data
      });

      callback && callback(req);
      FeedActions.receiveItems(req.items, req.pagination)
      return req;
    });
  }
};
