import Dispatcher from '../dispatcher/dispatcher';
import constants from './constants';

export default {
  receiveItems: function (items, meta) {
    Dispatcher.dispatch({
      actionType: constants.RECEIVE_ITEMS,
      meta: meta,
      items: items
    });
  },

  resetItems: function () {
    Dispatcher.dispatch({
      actionType: constants.RESET_ITEMS
    });
  }
};
