import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Tasks } from '../api/tasks.js';

export default class Task extends Component {
  toggleChecked() {
    const task = this.props.task;
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', task._id, !task.checked);
  }

  deleteThisTask() {
      Meteor.call('tasks.remove', this.props.task._id);
  }

  togglePrivate() {
    const task = this.props.task;
    Meteor.call('tasks.setPrivate', task._id, ! task.private);
  }

  render() {
    const taskClassName = classnames({
      checked: this.props.task.checked,
      private: this.props.task.private,
    });
    return (
      <li className={taskClassName}>
       <button className="delete" onClick={this.deleteThisTask.bind(this)}>
         &times;
       </button>

       <input
         type="checkbox"
         readOnly
         checked={this.props.task.checked}
         onClick={this.toggleChecked.bind(this)}
       />

       { this.props.showPrivateButton ? (
          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
            { this.props.task.private ? 'Private' : 'Public' }
          </button>
        ) : ''}

       <span className="text">
        <strong>{this.props.task.username}</strong>: {this.props.task.text}
      </span>
     </li>
    );
  }
}

Task.propTypes = {
  task: PropTypes.object.isRequired,
  showPrivateButton: PropTypes.bool.isRequired
};
