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
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
    };
  }

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

    Meteor.call('oppskrifter.insert', ['Chicken'], 'Chicken', 'U make da cheken', '20-30 minutes');
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map(task => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
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
          {`Oppskrifter er på vei! I mellomtiden, sjekk ut `}
          <Link to='/handlelister' className="lenke">
            Handlelister
          </Link>
        </header>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  oppskrifter: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object
};

export default withTracker(() => {
  Meteor.subscribe('tasks');
  Meteor.subscribe('oppskrifter');

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    oppskrifter: Oppskrifter.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user()
  };
})(App);
