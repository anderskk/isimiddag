import React from 'react';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
// route components
import App from '../../ui/App.jsx';
import OppskrifterPage from '../../ui/pages/OppskrifterPage.jsx';
import HandlelisterPage from '../../ui/pages/HandlelisterPage.jsx';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <div className="container">
      <Route exact path="/" component={App} />
      <Route path="/oppskrifter" component={OppskrifterPage} />
      <Route path="/handlelister" component={HandlelisterPage} />
    </div>
  </Router>
);
