'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash');

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

/*
EventSchema
 .pre('save', function(next) {
 this.updatedAt = new Date();
 //next();
 emailer.matchZipCode(this);
 next()
})
*/

// EventSchema
//   .pre('save', function(next) {
//     var event = this;
//     var emailSent = [];
//     Group.find({ zipCode: event.zipCode }, function(err, group) {
//       if (!group) {}
//       group.map(function(group){
//         console.log('post save email')
//         console.log(group.email)
//         emailSent.push(group.email)
//         console.log(emailSent)
//         event.sentEmails = emailSent
//       })
//       next()
//     });
//  });

module.exports = mongoose.model('Event', EventSchema);
