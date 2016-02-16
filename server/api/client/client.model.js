'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ClientSchema = new Schema({
  firstName: String,
  lastName: String,
  address: String,
  zipCode: String,
  gender: String,
  age: Number,
  availability: {
    moveInDate: Date, firstDate: Date, firstDateTime: String,
    secondDate: Date, secondDateTime: String,
    thirdDate: Date, thirdDateTime: String
  },
  registryUrl: String,
  notes: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Client', ClientSchema);
