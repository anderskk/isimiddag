import React from 'react';
import { Router, Route } from 'react-router';
import { Link } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import App from '../../ui/App.jsx';
import OppskrifterPage from '../../ui/pages/OppskrifterPage.jsx';
import HandlelisterPage from '../../ui/pages/HandlelisterPage.jsx';
import AccountsUIWrapper from '../../ui/AccountsUIWrapper.jsx';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => {
  return (
    <Router history={ browserHistory }>
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-drawer">
        <div className="mdl-layout__drawer">
          <span className="mdl-layout-title">Isi middag</span>
          <nav className="mdl-navigation">
            <Link to='/handlelister' className="mdl-navigation__link">
              Handlelister
            </Link>
            <Link to='/oppskrifter' className="mdl-navigation__link">
              Oppskrifter
            </Link>
          </nav>
        </div>
        <div className="mdl-layout__header-row">
          <span className="mdl-layout-title">
            <Link to='/' className="lenke">
              <i className="material-icons hjem-lenke">restaurant_menu</i>
              Isi Middag
            </Link>
          </span>
          <div className="mdl-layout-spacer" />
          <div className="innlogging">
            <AccountsUIWrapper />
          </div>
        </div>
        <Route exact path="/" component={ App } />
        <Route path="/oppskrifter" component={ OppskrifterPage } />
        <Route path="/handlelister" component={ HandlelisterPage } />
      </div>
    </Router>
  );
};
