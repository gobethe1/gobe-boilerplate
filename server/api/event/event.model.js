'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    emailer = require('./event.zipcodeMatch.emailer');

var EventSchema = new Schema({
  createdAt: {type: Date, default: Date.now()},
  updatedAt: Date,
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  address: {type: String, required: true},
  zipCode: {type: String, required: true},
  gender: String,
  age: Number,
  availability: {
    moveInDate: Date,
    firstDate: {type: Date, required: true},
    firstDateTime: {type: Array, required: true},
    secondDate: {type: Date, required: true},
    secondDateTime: {type: Array, required: true},
    thirdDate: {type: Date, required: true},
    thirdDateTime: {type: Array, required: true}
  },
  registryUrl: String,
  notes: String,
  host: String,
  confirmGroup: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
  confirmDate: Date,
  confirmTime: String,
  sentEmails: Array
});

EventSchema
 .pre('save', function(next) {
 this.updatedAt = new Date();
 next();
});

 EventSchema
  .pre('save', function(next) {
    // console.log(this)
  emailer.matchZipCode(this);
  next();
 });

module.exports = mongoose.model('Event', EventSchema);
