import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import { Tasks } from '../api/tasks.js';
import { Oppskrifter } from '../api/oppskrifter.js';
import Task from './Task.jsx';
import Oppskrift from './Oppskrift.jsx'

class App extends Component {
  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call('tasks.insert', text);

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  leggTilOppskrift(event) {
    event.preventDefault();

    Meteor.call('oppskrifter.insert', ['Chicken'], 'Chicken', 'U maek da cheken', '20-30 minutes');
  }

  renderOppskrifter() {
    const oppskrifter = this.props.oppskrifter;

    return oppskrifter.map(oppskrift => {
      return (
          <Oppskrift
            key={oppskrift._id}
            oppskrift={oppskrift}
          />
      );
    });
  }

  render() {
    return (
      <div>
        <header>
          <Link to='/oppskrifter' className="lenke">
            Oppskrifter
          </Link>
          {` er på vei! I mellomtiden, sjekk ut `}
          <Link to='/handlelister' className="lenke">
            Handlelister
          </Link>
        </header>
      </div>
    );
  }
}

App.propTypes = {
  oppskrifter: PropTypes.array.isRequired,
  currentUser: PropTypes.object
};

export default withTracker(() => {
  Meteor.subscribe('oppskrifter');

  return {
    oppskrifter: Oppskrifter.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user()
  };
})(App);
