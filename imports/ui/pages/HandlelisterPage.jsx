import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Vare from '../Vare.jsx';
import { Handlelister } from '../../api/handlelister.js';

class HandlelisterPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      gjeldendeHandleliste: null
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
  }

  renderHandlelister() {
    const handlelister = this.props.handlelister;
    // TODO: Dra handleliste ut i egen component med ekstra key-felt
    return handlelister.map(handleliste => {
      const gjeldende = this.state.gjeldendeHandleliste;
      let classnames = "handlelisteItem";
      if (gjeldende && gjeldende._id === handleliste._id) {
        classnames += " gjeldendeHandlelisteKnapp"
      }
      return (
        <li
          className="handlelisteItemWrapper"
          key={handleliste._id}>
          <button
            className={classnames}
            onClick={this.velgHandleliste.bind(this, handleliste)}
            ref="visHandleliste">
            { handleliste.tittel }
          </button>
        </li>
      );}
    );
  }

  renderGjeldendeHandleliste() {
    const gjeldendeHandleliste = this.state.gjeldendeHandleliste;
    const harVarer = !!gjeldendeHandleliste.varer;

    const tomVare = {};
    return (
      <div>
        { harVarer && gjeldendeHandleliste.varer.map((vare, index) => {
          return (
            <Vare
              key={gjeldendeHandleliste._id + index}
              vare={vare}
              vareIndex={index}
              handlelisteId={gjeldendeHandleliste._id}
              />
            );}
          )
        }
        {/* Burde kanskje ikke la Vare ta seg av dette? */}
        <Vare
          vare={tomVare}
          handlelisteId={gjeldendeHandleliste._id}
          />
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
    // const bruker = currentUser ? currentUser.username + '\'s'  : 'Mine';

    return (
      <div>
        <header>
          <button
            onClick={this.nyHandleliste.bind(this)}
            ref="nyHandleliste">
            Ny handleliste
          </button>
          <h1>{bruker} handlelister</h1>
        </header>

        <div className="col-2">
          <ul>
            { this.renderHandlelister() }
          </ul>

          { this.state.gjeldendeHandleliste && this.renderGjeldendeHandleliste()}
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
