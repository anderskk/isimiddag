import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import { Handlelister } from '../api/handlelister.js';

export default class Vare extends Component {

  leggTilVare(event) {
    event.preventDefault();

    const varenavnNode = ReactDOM.findDOMNode(this.refs.varenavnInput);
    const varenavn = varenavnNode.value.trim();

    const vare = {
      varenavn,
      erUtfoert: false
    };
    Meteor.call('handlelister.leggTilVare', this.props.handlelisteId, vare);

    varenavnNode.value = '';
  }

  settUtfoert() {
    const { handlelisteId, vareIndex } = this.props;
    Meteor.call('handlelister.settVareUtfoert', handlelisteId, vareIndex);
  }

  slettVare() {
    const { handlelisteId, varenavn } = this.props;
    Meteor.call('handlelister.slettVare', handlelisteId, vare);
  }

  renderVare() {
    const { vare } = this.props;
    let vareClassName = 'varelinje';
    if (vare.erUtfoert) {
      vareClassName += ' utfoert';
    }
    return (
      <div className={vareClassName}>
        <input
          type="checkbox"
          readOnly
          checked={vare.erUtfoert}
          onClick={this.settUtfoert.bind(this)}
          />
        <span className="varenavn">
          { vare.varenavn }
        </span>
      </div>
    );
  }

  renderNyVare() {
    return (
      <form className="nyVare" onSubmit={this.leggTilVare.bind(this)} >
        <input
          type="text"
          ref="varenavnInput"
          placeholder="Skriv her"
          />
      </form>
    );
  }

  render() {
    const { vare } = this.props;
    return (
      <div>
        { vare.varenavn ? this.renderVare() : this.renderNyVare() }
      </div>
    );
  }
}

Vare.propTypes = {
  vare: PropTypes.object.isRequired,
  vareIndex: PropTypes.number,
  handlelisteId: PropTypes.string
};
