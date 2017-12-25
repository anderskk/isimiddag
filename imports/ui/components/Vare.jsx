import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import { Handlelister } from '../../api/handlelister.js';

export default class Vare extends Component {

  leggTilVare(event) {
    event.preventDefault();

    const varenavnNode = ReactDOM.findDOMNode(this.refs.varenavnInput);
    const varenavn = varenavnNode.value.trim();

    if (varenavn) {
      const vare = {
        varenavn,
        erUtfoert: false
      };
      Meteor.call('handlelister.leggTilVare', this.props.handlelisteId, vare);

      varenavnNode.value = '';
    }
  }

  settUtfoert() {
    const { handlelisteId, vareIndex } = this.props;
    Meteor.call('handlelister.settVareUtfoert', handlelisteId, vareIndex);
  }

  slettVare() {
    const { handlelisteId, varenavn } = this.props;
    Meteor.call('handlelister.slettVare', handlelisteId, vare);
  }

  onFocus() {
    const varenavnNode = ReactDOM.findDOMNode(this.refs.varenavnInput);
    varenavnNode.scrollIntoView({ behavior: "smooth" });
  }

  renderVare() {
    const { vare, vareIndex } = this.props;
    let vareClassName = 'varelinje';
    if (vare.erUtfoert) {
      vareClassName += ' utfoert';
    }
    const id = 'vareCheckbox' + vareIndex;
    return (
      <div className={vareClassName}>
        <input
          type="checkbox"
          className="vare-checkbox"
          id={id}
          readOnly
          checked={vare.erUtfoert}
          onClick={this.settUtfoert.bind(this)}
          />
          <label htmlFor={id} className="varenavn">
            { vare.varenavn }
          </label>
      </div>
    );
  }

  renderNyVare() {
    return (
      <form className="ny-vare" onSubmit={ this.leggTilVare.bind(this) } >
        <input
          type="text"
          id="ny-vare"
          ref="varenavnInput"
          placeholder="Ny vare"
          />
      </form>
    );
  }

  render() {
    const { vare } = this.props;
    return !!vare.varenavn ? this.renderVare() : this.renderNyVare();
  }
}

Vare.propTypes = {
  vare: PropTypes.object.isRequired,
  vareIndex: PropTypes.number.isRequired,
  handlelisteId: PropTypes.string
};
