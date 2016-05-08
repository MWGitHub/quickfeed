require('normalize.css');
require('./css/main.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Feed from './feed/feed';

class App extends React.Component {
  render() {
    return (
      <div>
        <div className="nav">
          <h1>QuickFeed</h1>
        </div>
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

const router = (
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={Feed} />
    </Route>
  </Router>
)

document.addEventListener('DOMContentLoaded', _ => {
  ReactDOM.render(router, document.getElementById('main'));
});
