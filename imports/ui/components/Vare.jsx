import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import { Handlelister } from '../../api/handlelister.js';

export default class Vare extends Component {

  constructor(props) {
    super(props);

    this.state = {
      nyVareFokusert: false,
      nyVareHarVerdi: false
    };
  }

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
      this.setState({ nyVareHarVerdi: false });

      varenavnNode.value = '';
    }
  }

  settFokus = fokus => {
    this.setState({ nyVareFokusert: fokus });
    if (fokus) {
      const varenavnNode = ReactDOM.findDOMNode(this.refs.varenavnInput);
      varenavnNode.scrollIntoView({ behavior: "smooth" });
    }
  };

  settUtfoert() {
    const { handlelisteId, vareIndex } = this.props;
    Meteor.call('handlelister.settVareUtfoert', handlelisteId, vareIndex);
  }

  slettVare() {
    const { handlelisteId, varenavn } = this.props;
    Meteor.call('handlelister.slettVare', handlelisteId, vare);
  }

  onChange = () => {
    const varenavnNode = ReactDOM.findDOMNode(this.refs.varenavnInput);
    const varenavn = varenavnNode.value.trim();
    if (varenavn && !this.state.nyVareHarVerdi) {
      this.setState({ nyVareHarVerdi: true });
    } else if (!varenavn && this.state.nyVareHarVerdi) {
      this.setState({ nyVareHarVerdi: false });
    }
  }

  renderVare() {
    const { vare, vareIndex } = this.props;

    const vareklasser = classnames({
      varelinje: true,
      utfoert: vare.erUtfoert
    });
    const id = 'vareCheckbox' + vareIndex;
    return (
      <div className={ vareklasser } onClick={ this.settUtfoert.bind(this) }>
        <div className="varenavn">
          { vare.varenavn }
        </div>
      </div>
    );
  }

  renderNyVare() {
    const klasser = classnames({
      'mdl-textfield': true,
      'mdl-js-textfield': true,
      'mdl-textfield--floating-label': true,
      'is-focused': this.state.nyVareFokusert
    });

    return (
      <form className="ny-vare" onSubmit={ this.leggTilVare.bind(this) }>
        <div className={ klasser }>
          <input
            className="mdl-textfield__input"
            type="text"
            ref="varenavnInput"
            onFocus={ () => this.settFokus(true) }
            onBlur={ () => this.settFokus(false) }
            onChange={ this.onChange }
            id="ny-vare" />
          <label className="mdl-textfield__label" htmlFor="ny-vare">Ny vare</label>
        </div>
        { this.state.nyVareHarVerdi &&
          <button
            onClick={ this.leggTilVare.bind(this) }
            className="icon-knapp legg-til-vare">
            <i className="material-icons nyHandleliste">add_circle_outline</i>
          </button>
        }
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
