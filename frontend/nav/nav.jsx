import React from 'react';
import FeedActions from '../feed/actions';
import { Link } from 'react-router';

class Nav extends React.Component {
  _handleTypeClick(type) {
    return function (e) {
      e.preventDefault();
      FeedActions.receiveType(type);
    }
  }

  render() {
    return (
      <div className="nav group">
        <div className="nav-header">
          <h1><Link to='/'>QuickFeed</Link></h1>
        </div>
        <div className="nav-sort">
          <ul className="group">
            <li>
              <a href="#" onClick={this._handleTypeClick('default')}>Latest</a>
            </li>
            <li>
              <a href="#" onClick={this._handleTypeClick('likes')}>Most Liked</a>
            </li>
            <li>
              <a href="#" onClick={this._handleTypeClick('comments')}>Most Commented</a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Nav;
