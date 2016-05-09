import { Store } from 'flux/utils';
import Dispatcher from '../dispatcher/dispatcher';
import constants from './constants';

let FeedStore = new Store(Dispatcher);

let _items = [];
let _meta = {};

function receiveItems(items, meta) {
  _meta = meta;
  _items = _items.concat(items);
}

FeedStore.all = function () {
  return _items.slice();
}

FeedStore.getMeta = function () {
  return Object.assign({}, _meta);
}

FeedStore.__onDispatch = function (payload) {
  switch (payload.actionType) {
    case constants.RECEIVE_ITEMS:
      receiveItems(payload.items, payload.meta);
      FeedStore.__emitChange();
      break;
    case constants.RESET_ITEMS:
      _items = [];
      _meta = {};
      FeedStore.__emitChange();
      break;
  }
};

export default FeedStore;
