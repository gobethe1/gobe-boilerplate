'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    emailer = require('./groupemailer');

var GroupSchema = new Schema({
  createdAt: {type: Date, default: Date.now()},
  updatedAt: Date,
  organizationName: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true},
  phoneNumber: {type: String, required: true},
  zipCode: {type: String, required: true}
});

/*
GroupSchema
 .pre('save', function(next) {
 this.updatedAt = new Date();
 //next()
 emailer.matchZipCode(this);
 next();
});
*/

module.exports = mongoose.model('Group', GroupSchema);
