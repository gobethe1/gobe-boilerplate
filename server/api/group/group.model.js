'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    emailer = require('./group.emailer');

var GroupSchema = new Schema({
  ownedBy: {type: mongoose.Schema.Types.ObjectId,
             ref: 'User'},
  createdAt: {type: Date, default: Date.now()},
  updatedAt: Date,
  organizationName: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true},
  phoneNumber: {type: String, required: true},
  address: {type: String, required: true},
  zipCode: {type: String, required: true},
  matchRadius: Number,
  matchZipCodeArr: Array,
  previousEmailList: Array,
  emailList: Array
});


GroupSchema
 .pre('save', function(next) {
 this.updatedAt = new Date();
 next();
});


module.exports = mongoose.model('Group', GroupSchema);
