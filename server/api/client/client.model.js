'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ClientSchema = new Schema
  createdAt: Date.now(),
  updatedAt: Date.now(),
  lastName: {type: String, required: true}
  address: {type: String, required: true}
  zipCode: {type: String, required: true}
  gender: String,
  age: Number,
  availability: {
    moveInDate: {type: Date, required: true},
    firstDate: {type: Date, required: true},
    firstDateTime: {type: String, required: true}
    secondDate: {type: Date, required: true},
    secondDateTime: {type: String, required: true},
    thirdDate: {type: Date, required: true},
    thirdDateTime: {type: String, required: true}
  },
  registryUrl: String,
  notes: String
});

ClientSchema
 .pre('save', function(next) {
 this.updatedAt = new Date();
 next();
});

module.exports = mongoose.model('Client', ClientSchema);
