import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Oppskrifter } from '../api/oppskrifter.js';

export default class Oppskrift extends Component {

  render() {
    return (
      <div>
        Title: {this.props.oppskrift.title}
      </div>
    );
  }
}

Oppskrift.propTypes = {
  oppskrift: PropTypes.object.isRequired
};
