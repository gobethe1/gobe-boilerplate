'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    emailer = require('./event.zipcodeMatch.emailer'),
    Group = require('../group/group.model');

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

var finZip = function(next){

  var promise = emailer.findZip(this)
  promise.then(function(jedis){
    var emails = [];
    console.log(jedis)
     jedis.forEach(function(jedi){
        console.log("jedi email")
        console.log(jedi.email);
        emails.push(jedi.email)
     })

     console.log("emails")
     console.log(emails)
     return emails
     // this.sentEmails = emails;
   })
  this.sentEmails = emails;
  next()
}

EventSchema
 .pre('save', function(next) {
 this.updatedAt = new Date();
 next();
});

 // EventSchema
 //    .pre('save', finZip)

 EventSchema
  .post('save', function() {
   // this.matchZip(this) 
   // console.log(this.matchZip(this))
    // console.log(this)
  // emailer.matchZipCode(this);
  // this.sentEmails = emailer.addSentEmail(this, next)
  // emailer.saveSentEmails(this, next)
  // var test = emailer.addSentEmail(this, next)
  // console.log("test")
  // console.log(test.tree)
  emailer.checkZip(this);
  // console.log("pre save hook")
  // console.log(emailer.checkZip(this))
  // next();
 });

 EventSchema.methods = {
    matchZip: function(event){
       var test = Group.find({ zipCode: event.zipCode })
       return test;
    }

 } 

module.exports = mongoose.model('Event', EventSchema);
