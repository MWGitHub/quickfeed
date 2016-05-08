import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>QuickFeed</h1>
      </div>
    );
  }
}

const router = (
  <Router history={browserHistory}>
    <Route path='/' component={App}>

    </Route>
  </Router>
)

document.addEventListener('DOMContentLoaded', _ => {
  ReactDOM.render(router, document.getElementById('content'));
});
