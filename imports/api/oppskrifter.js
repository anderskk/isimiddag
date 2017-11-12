import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Oppskrifter = new Mongo.Collection('opskrifter');

if (Meteor.isServer) {
  Meteor.publish('oppskrifter', function OppskrifterPublication() {
    return Oppskrifter.find({
      eier: this.userId
    });
  });
}

Meteor.methods({
  'oppskrifter.insert'(ingredienser, tittel, beskrivelse, tidsestimat) {

    debugger;
    // Make sure the user is logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Oppskrifter.insert({
      ingredienser,
      tittel,
      beskrivelse,
      tidsestimat,
      createdAt: new Date(),
      eier: Meteor.userId(),
      brukernavn: Meteor.user().username,
    });
  },
  'oppskrifter.remove'(oppskriftId) {
    check(oppskriftId, String);

    const oppskrift = Oppskrifter.findOne(oppskriftId);
    if (oppskrift.eier !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Oppskrifter.remove(oppskriftId);
  }
});
