import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import classnames from 'classnames';

import Vare from '../components/Vare.jsx';
import Handleliste from '../components/Handleliste.jsx';
import { Handlelister } from '../../api/handlelister.js';

const formatterDato = dato =>
  `${dato.getDate()}.${dato.getMonth()+1}.${dato.getUTCFullYear()}`;

class HandlelisterPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      gjeldendeHandleliste: null,
      skalSlettes: null,
      skalOppretteNyHandleliste: false
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

  componentDidUpdate(prevProps) {
    const handlelister = this.props.handlelister;
    const gjeldendeHandleliste = this.state.gjeldendeHandleliste;

    const handlelisterFinnes = handlelister && handlelister.length > 0;
    if (handlelisterFinnes) {
      const handlelisterOppdatert = !gjeldendeHandleliste
        || prevProps.handlelister.length < handlelister.length
      if (handlelisterOppdatert) {
        this.setState({ gjeldendeHandleliste: handlelister[0] });
      }
    }
  }

  opprettHandleliste(event) {
    if (event) {
      event.preventDefault();
    }

    const tittelNode = ReactDOM.findDOMNode(this.refs.opprettHandlelisteInput);
    let tittel = tittelNode.value.trim();
    if (!tittel) {
      tittel = formatterDato(new Date());
    }

    Meteor.call('handlelister.opprettHandleliste', tittel);

    this.setState({
      skalOppretteNyHandleliste: !this.state.skalOppretteNyHandleliste
    });
    ReactDOM.findDOMNode(this.refs.opprettHandlelisteInput).value = '';
  }

  // angiTittel(handlelisteId, event) {
  //   event.preventDefault();
  //
  //   const tittelNode = ReactDOM.findDOMNode(this.refs.tittelInput);
  //   let tittel = tittelNode.value.trim();
  //   if (!tittel) {
  //     tittel = formatterDato(new Date());
  //   }
  //
  //   Meteor.call('handlelister.angiTittel', handlelisteId, tittel);
  // }

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
    const erGjeldende = gjeldende && gjeldende._id === handleliste._id;
    const knappklasser = classnames({
      handlelisteItem: true,
      gjeldendeHandlelisteKnapp: erGjeldende
    });
    const handlelisteklasser = classnames({
      'pull-up': !erGjeldende,
      'pull-down': erGjeldende
    });

    return (
      <div>
        <div
          className="handlelisteItemWrapper"
          key={handleliste._id}>
          <button
            className={ knappklasser }
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
        <div className={ handlelisteklasser }>
          <Handleliste handleliste={ handleliste } />
        </div>
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
            <i className="material-icons">thumb_up</i>
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

  skalOppretteNyHandleliste(event) {
    event.preventDefault();

    const { skalOppretteNyHandleliste } = this.state;

    this.setState({
      skalOppretteNyHandleliste: !skalOppretteNyHandleliste
    })
  }

  renderOpprettNyHandleliste() {
    const { skalOppretteNyHandleliste } = this.state;

    const inputKlasser = classnames({
      'ny-handleliste-input': true,
      transition: skalOppretteNyHandleliste
    });

    const icon = skalOppretteNyHandleliste
      ? 'check_circle'
      : 'add_circle_outline';
    const fn = skalOppretteNyHandleliste
      ? this.opprettHandleliste.bind(this)
      : this.skalOppretteNyHandleliste.bind(this);

      return (
      <div className="flex">
        <form onSubmit={ fn }>
          <input
            type="text"
            className={ inputKlasser }
            ref="opprettHandlelisteInput"
            placeholder="Ny handleliste" />
        </form>
        <button
          onClick={ fn }
          className="icon-knapp ny-handleliste-knapp"
          ref="nyHandleliste">
          <i className="material-icons nyHandleliste">{ icon }</i>
        </button>
      </div>
    )
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
          <div className="flex">
            <h1>{bruker} handlelister</h1>
            { this.renderOpprettNyHandleliste() }
          </div>
        </header>

        <div className="flex">
          <ul className="alleHandlelister">
            { this.renderHandlelister() }
          </ul>

          {/* { this.state.gjeldendeHandleliste &&
            <Handleliste handleliste={ this.state.gjeldendeHandleliste } /> } */}
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
    handlelister: Handlelister.find({}, { sort: { opprettetDato: -1 } }).fetch(),
    currentUser: Meteor.user()
  };
})(HandlelisterPage);
