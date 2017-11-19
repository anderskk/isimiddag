import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Vare from '../components/Vare.jsx';
import Handleliste from '../components/Handleliste.jsx';
import { Handlelister } from '../../api/handlelister.js';

class HandlelisterPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      gjeldendeHandleliste: null,
      skalSlettes: null
    };
  }

  componentWillReceiveProps(props) {
    const handlelister = props.handlelister;
    if (handlelister && handlelister.length > 0) {
      if (this.state.gjeldendeHandleliste) {
        const id = this.state.gjeldendeHandleliste._id;
        const gjeldendeHandleliste = props.handlelister.find(liste =>
          liste._id === id
        );
        // Må oppdatere gjeldende handleliste når vi henter alle varer for den
        // som er trykket på
        this.setState({ gjeldendeHandleliste });
      }
    } else {
      this.setState({ gjeldendeHandleliste: null })
    }
  }

  componentDidUpdate() {
    // Sett første handleliste som gjeldende
    const handlelister = this.props.handlelister;
    if (handlelister && handlelister.length > 0 && !this.state.gjeldendeHandleliste) {
      this.setState({ gjeldendeHandleliste: this.props.handlelister[0] });
    }
  }

  nyHandleliste(event) {
    event.preventDefault();

    Meteor.call('handlelister.opprettHandleliste');
  }

  velgHandleliste(handleliste, event) {
    this.setState({ gjeldendeHandleliste: handleliste });
    document.getElementById('gjeldendeHandleliste').scrollIntoView();
  }

  settSkalSlettes(handleliste) {
    this.setState({ skalSlettes: handleliste })
  }

  slettHandleliste(handleliste, event) {
    Meteor.call('handlelister.slett', handleliste._id);
  }

  renderStandardvisning(handleliste) {
    const gjeldende = this.state.gjeldendeHandleliste;
    let classnames = "handlelisteItem";
    if (gjeldende && gjeldende._id === handleliste._id) {
      classnames += " gjeldendeHandlelisteKnapp";
    }
    return (
      <div
        className="handlelisteItemWrapper"
        key={handleliste._id}>
        <button
          className={classnames}
          onClick={this.velgHandleliste.bind(this, handleliste)}
          ref="visHandleliste">
          { handleliste.tittel }
          <button
            className="icon-knapp slettHandleliste"
            onClick={this.settSkalSlettes.bind(this, handleliste)}
            >
            <i className="material-icons">clear</i>
          </button>
        </button>
      </div>
    );
  }

  renderSkalSlettesVisning() {
    const handleliste = this.state.skalSlettes;
    return (
      <div className="skal-slette-handleliste">
        Slett handleliste?
        <div>
          <button
            className="icon-knapp"
            onClick={this.slettHandleliste.bind(this, handleliste)}>
            <i className="material-icons slett-ja">thumb_up</i>
          </button>
          <button
            className="icon-knapp"
            onClick={this.settSkalSlettes.bind(this, null)}>
            <i className="material-icons slett-nei">thumb_down</i>
          </button>
        </div>
      </div>
    );
  }

  renderHandlelister() {
    const handlelister = this.props.handlelister;
    // TODO: Dra handlelister ut i egen component
    return handlelister.map(handleliste => {
      const skalSlettes = this.state.skalSlettes;
      if (!!skalSlettes && handleliste._id === skalSlettes._id) {
        return this.renderSkalSlettesVisning();
      }
      return this.renderStandardvisning(handleliste);
    });
  }

  render() {
    const { currentUser } = this.props;
    const erInnlogget = !!currentUser;
    let bruker;
    if (erInnlogget) {
      const brukernavn = currentUser.username;
      const sisteBokstavIBrukernavn = brukernavn[brukernavn.length - 1];
      bruker = sisteBokstavIBrukernavn === 's' ? brukernavn + '\'' : brukernavn + 's';
    } else {
      bruker = 'Mine';
    }

    return (
      <div>
        <header>
          <div className="col-2">
            <h1>{bruker} handlelister</h1>
            <button
              onClick={this.nyHandleliste.bind(this)}
              className="icon-knapp"
              ref="nyHandleliste">
              <i className="material-icons nyHandleliste">add_circle_outline</i>
            </button>
          </div>
        </header>

        <div className="col-2">
          <ul className="alleHandlelister">
            { this.renderHandlelister() }
          </ul>

          { this.state.gjeldendeHandleliste &&
            <Handleliste handleliste={ this.state.gjeldendeHandleliste } /> }
        </div>
      </div>
    );
  }
}

HandlelisterPage.propTypes = {
  handlelister: PropTypes.array.isRequired,
  currentUser: PropTypes.object
};

export default withTracker(() => {
  Meteor.subscribe('handlelister');

  return {
    handlelister: Handlelister.find({}).fetch(),
    currentUser: Meteor.user()
  };
})(HandlelisterPage);
