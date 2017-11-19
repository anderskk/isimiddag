import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

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

const SorterbarItem = SortableElement(({vare, vareIndex, id}) =>
  <div className="col-2">
    <DragHandle />
    <Vare
      vare={vare}
      vareIndex={vareIndex}
      handlelisteId={id}
    />
  </div>
);

const SorterbarListe = SortableContainer(({varer, id}) =>
  <ul>
    {varer.map((vare, index) =>
      <SorterbarItem
        key={`vare-${index}`}
        vareIndex={index}
        vare={vare}
        id={id}
        index={index}
       />
     )}
  </ul>
);

export default class Handleliste extends Component {

  endreRekkefoelgePaaVarer = ({ oldIndex, newIndex }) => {
    const { handleliste } = this.props;
    const nyRekkefoelge = arrayMove(handleliste.varer, oldIndex, newIndex);
    Meteor.call('handlelister.endreRekkefoelgePaaVarer',
      handleliste._id, nyRekkefoelge);
  }

  render() {
    const handleliste = this.props.handleliste;
    const harVarer = !!handleliste.varer;

    const tomVare = {};
    const varer = harVarer && handleliste.varer.map((vare, index) =>
      <Vare
        key={handleliste._id + index}
        vare={vare}
        vareIndex={index}
        handlelisteId={handleliste._id}
        />
      );

    return (
      <div id="gjeldendeHandleliste">
        <SorterbarListe
          useDragHandle={ true }
          lockAxis="y"
          varer={ handleliste.varer }
          onSortEnd={ this.endreRekkefoelgePaaVarer }
          id={ handleliste._id }
         />
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
