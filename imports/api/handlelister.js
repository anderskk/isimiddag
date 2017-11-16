import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Handlelister = new Mongo.Collection('handlelister');

if (Meteor.isServer) {
  Meteor.publish('handlelister', function handlelisterPublication() {
    return Handlelister.find({ eier: this.userId });
  });
}

const checkVare = vare => {
  check(vare.varenavn, String);
  check(vare.erUtfoert, Boolean);
};

Meteor.methods({
  'handlelister.opprettHandleliste'() {

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Handlelister.insert({
      tittel: 'Ny handleliste!',
      varer: [],
      opprettetDato: new Date(),
      eier: Meteor.userId(),
      brukernavn: Meteor.user().username,
    });
  },
  'handlelister.nyTittel'(handlelisteId, tittel) {
    check(handlelisteId, String);
    check(tittel, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Handlelister.update(handlelisteId, { $set: { tittel } });
  },
  'handlelister.slett'(handlelisteId) {
    check(handlelisteId, String);

    const handleliste = Handlelister.findOne(handlelisteId);
    if (handleliste.eier !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Handlelister.remove(handlelisteId);
  },
  'handlelister.leggTilVare'(handlelisteId, vare) {
    check(handlelisteId, String);
    checkVare(vare);

    const handleliste = Handlelister.findOne(handlelisteId);
    if (handleliste.eier !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    const varer = handleliste.varer;
    varer.push(vare);
    Handlelister.update(handlelisteId, { $set: { varer } });
  },
  'handlelister.oppdaterVare'(handlelisteId, vare, fjernVare) {
    check(fjernVare, Boolean);
    if (fjernVare) {
      // fjern vare fra lista
    } else {
      // oppdater varenavn eller antall
    }
  },
  'handlelister.settVareUtfoert'(handlelisteId, vareIndex) {
    check(handlelisteId, String);
    check(vareIndex, Number);

    const handleliste = Handlelister.findOne(handlelisteId);
    if (handleliste.eier !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    let varer = handleliste.varer;

    varer[vareIndex].erUtfoert = !varer[vareIndex].erUtfoert;

    Handlelister.update(handlelisteId,  { $set: { varer } });
  },
  'handlelister.settVareRekkefoelge'() {
    // Ny varerekkefølge
  }
});
