import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import Vare from './Vare.jsx';
import { Handlelister } from '../../api/handlelister.js';

export default class Handleliste extends Component {

  render() {
    const handleliste = this.props.handleliste;
    const harVarer = !!handleliste.varer;

    const tomVare = {};
    return (
      <div id="gjeldendeHandleliste">
        { harVarer && handleliste.varer.map((vare, index) => {
          return (
            <Vare
              key={handleliste._id + index}
              vare={vare}
              vareIndex={index}
              handlelisteId={handleliste._id}
              />
            );}
          )
        }
        {/* Burde kanskje ikke la Vare ta seg av dette? */}
        <Vare
          vare={tomVare}
          handlelisteId={handleliste._id}
          />
      </div>
    );
  }
}

Handleliste.propTypes = {
  handleliste: PropTypes.object.isRequired
};
