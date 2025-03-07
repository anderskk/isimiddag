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
      gjeldendeHandlelisteId: null,
      skalSlettes: null,
      skalOppretteNyHandleliste: false
    };
  }

  componentDidUpdate(prevProps) {
    this.settNyhandlelisteSomGjeldende(prevProps);
  }

  settNyhandlelisteSomGjeldende(prevProps) {
    const handlelister = this.props.handlelister;
    const gjeldendeHandlelisteId = this.state.gjeldendeHandlelisteId;

    const handlelisterFinnes = handlelister && handlelister.length > 0;
    if (handlelisterFinnes) {
      const handlelisterOppdatert = prevProps.handlelister.length < handlelister.length
      if (handlelisterOppdatert) {
        this.setState({ gjeldendeHandlelisteId: handlelister[0]._id });
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

  renderHandlelister() {
    const handlelister = this.props.handlelister;
    const handelisterelementer = handlelister.map((handleliste, index) => {
      const callback = () => {
        if (this.state.gjeldendeHandlelisteId === handleliste._id) {
            this.setState({ gjeldendeHandlelisteId: null });
        } else {
          this.setState({ gjeldendeHandlelisteId: handleliste._id });
        }
      };
      return (
        <Handleliste
          key={ `handleliste-${index}` }
          handleliste={ handleliste }
          erGjeldende={ this.state.gjeldendeHandlelisteId === handleliste._id }
          gjoerGjeldende={ callback } />
    ) });

    return (
      <div>
        { handelisterelementer }
      </div>
    );
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

    return (
      <div>
        <header className="page-header">
          <div className="flex space-between innhold-blokk">
            <h4>Mine handlelister</h4>
            { this.renderOpprettNyHandleliste() }
          </div>
        </header>

        <div className="flex">
          <ul className="handlelister">
            { this.renderHandlelister() }
          </ul>
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
