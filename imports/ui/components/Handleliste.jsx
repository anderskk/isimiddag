import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import Vare from './Vare.jsx';
import { Handlelister } from '../../api/handlelister.js';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove
} from 'react-sortable-hoc';

const DragHandle = SortableHandle(() =>
  <i className="material-icons drag-handle">drag_handle</i>
);

const SorterbarItem = SortableElement(({ vare, vareIndex, id }) =>
  <div>
    <div className="flex nowrap vare-wrapper">
      <DragHandle />
      <Vare
        vare={ vare }
        vareIndex={ vareIndex }
        handlelisteId={ id }
      />
    </div>
  </div>
);

const SorterbarListe = SortableContainer(({ varer, id }) =>
  <ul>
    { varer.map((vare, index) =>
      <SorterbarItem
        key={`vare-${index}`}
        vareIndex={ index }
        vare={ vare }
        id={ id }
        index={ index }
       />
     ) }
  </ul>
);

export default class Handleliste extends Component {

  constructor(props) {
    super(props);

    this.state = {
      skalSlettes: false
    };
  }

  endreRekkefoelgePaaVarer = ({ oldIndex, newIndex }) => {
    const { handleliste } = this.props;
    const nyRekkefoelge = arrayMove(handleliste.varer, oldIndex, newIndex);
    Meteor.call('handlelister.endreRekkefoelgePaaVarer',
      handleliste._id, nyRekkefoelge);
  };

  settSkalSlettes = skalSlettes => {
    this.setState({ skalSlettes });
  };

  slettHandleliste = () => {
    this.setState({ skalSlettes: false });
    Meteor.call('handlelister.slett', this.props.handleliste._id);
  };

  renderVarer() {
    const { handleliste, erGjeldende } = this.props;

    const tomVare = {};

    const sorterbarVareliste = (
      <SorterbarListe
        useDragHandle={ true }
        lockAxis="y"
        varer={ handleliste.varer }
        onSortEnd={ this.endreRekkefoelgePaaVarer }
        id={ handleliste._id }
       />
     );
     const handlelisteklasser = classnames({
       'pull-up': !erGjeldende,
       'pull-down': erGjeldende
     });
    return (
      <div id={ `handleliste-${handleliste._id}` }
        className={ handlelisteklasser }>
        { erGjeldende && sorterbarVareliste }
        { erGjeldende &&
          <Vare
            vare={ tomVare }
            vareIndex={ handleliste.varer.length }
            handlelisteId={ handleliste._id }
            />
        }
      </div>
    );
  }

  render() {
    const { handleliste, erGjeldende, gjoerGjeldende } = this.props;
    const headerklasser = classnames({
      'handleliste-header': true,
      'gjeldende-handleliste': erGjeldende
    });

    let tittel, handlingelementer;
    if (this.state.skalSlettes) {
      tittel = 'Slett handleliste?';
      handlingelementer = (
        <div className="flex nowrap">
          <button
            className="icon-knapp"
            onClick={ this.slettHandleliste }>
            <i className="material-icons">thumb_up</i>
          </button>
          <button
            className="icon-knapp"
            onClick={ () => this.settSkalSlettes(false) }>
            <i className="material-icons slett-nei">thumb_down</i>
          </button>
        </div>
      );
    } else {
      tittel = handleliste.tittel;
      handlingelementer = (
        <button
          className="icon-knapp slett-handleliste"
          onClick={ () => this.settSkalSlettes(true) }
          >
          <i className="material-icons">clear</i>
        </button>
      );
    }

    return (
      <div>
        <div className={ headerklasser }>
          <div className="handleliste-tittel"
            onClick={ gjoerGjeldende }>
            { tittel }
          </div>
          { handlingelementer }
        </div>
        { this.renderVarer() }
      </div>
    );
  }
}

Handleliste.propTypes = {
  handleliste: PropTypes.object.isRequired,
  erGjeldende: PropTypes.bool.isRequired,
  gjoerGjeldende: PropTypes.func.isRequired
};
