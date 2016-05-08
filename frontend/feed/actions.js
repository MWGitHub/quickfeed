import Dispatcher from '../dispatcher';
import constants from './constants';

export default {
  receiveItems: function (items) {
    Dispatcher.dispatch({
      actionType: constants.RECEIVE_ITEMS,
      meta: {
        pagination: items.pagination
      },
      items: items
    });
  },

  resetItems: function () {
    Dispatcher.dispatch({
      actionType: constants.RESET_ITEMS
    })
  }
}
