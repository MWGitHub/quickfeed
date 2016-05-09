import { Store } from 'flux/utils';
import Dispatcher from '../dispatcher/dispatcher';
import constants from './constants';

let FeedTypeStore = new Store(Dispatcher);

let _type = 'default';

FeedTypeStore.getType = function () {
  return _type;
}

FeedTypeStore.__onDispatch = function (payload) {
  switch (payload.actionType) {
    case constants.RECEIVE_TYPE:
      _type = payload.type;
      FeedTypeStore.__emitChange();
      break;
  }
};

export default FeedTypeStore;
