'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash');

var EventSchema = new Schema({
  createdAt: {type: Date, default: Date.now},
  updatedAt: Date,
  published: Boolean,
  userId: {type: mongoose.Schema.Types.ObjectId,
             ref: 'User'
        },
  eventName: String,
  groupOnly: {type: Boolean, default: false},
  numberOfVolunteers: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  organizerFirstName: String,
  organizerLastName: String,
  organizerEmail: String,
  organizerPhoneNumber: String,
  address: String,
  meetupAddress: String,
  zipCode: String,
  gender: String,
  age: Number,
  causeType: String,
  veteran: Boolean,
  dateTimes: Array,
  availability: {
    moveInDate: Date,
    firstDate: Date,
    firstDateTime: Array,
    secondDate: Date,
    secondDateTime: Array,
    thirdDate: Date,
    thirdDateTime: Array
  },
  registryUrl: String,
  notes: String,
  description: String,
  host: String,
  confirmIndividuals: Array,
  confirmGroup: {type: mongoose.Schema.Types.ObjectId, ref: 'Group', default:null},
  confirmDate: Date,
  confirmTime: String,
  confirmedEmails: Array,
  rejectedEmails: Array
});


EventSchema
 .pre('save', function(next) {
 this.updatedAt = new Date();
 next()
})

module.exports = mongoose.model('Event', EventSchema);
