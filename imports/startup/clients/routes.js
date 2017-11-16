import React from 'react';
import { Router, Route } from 'react-router';
import { Link } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
// route components
import App from '../../ui/App.jsx';
import OppskrifterPage from '../../ui/pages/OppskrifterPage.jsx';
import HandlelisterPage from '../../ui/pages/HandlelisterPage.jsx';
import AccountsUIWrapper from '../../ui/AccountsUIWrapper.jsx';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <div className="container">
      <div className="navBar">
        <Link to='/' className="lenke">
          <i className="material-icons">restaurant_menu</i>
          Isi Middag
        </Link>
        <Link to='/handlelister' className="lenke">
          Handlelister
        </Link>
        <div className="innlogging">
          <AccountsUIWrapper />
        </div>
      </div>
      <Route exact path="/" component={App} />
      <Route path="/oppskrifter" component={OppskrifterPage} />
      <Route path="/handlelister" component={HandlelisterPage} />
    </div>
  </Router>
);
