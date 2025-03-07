import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import '../imports/startup/accounts-config.js';
import App from '../imports/ui/App.jsx';
import { renderRoutes } from '../imports/startup/clients/routes.js';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('render-target'));
});
