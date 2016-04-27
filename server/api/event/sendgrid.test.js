'use strict';

var mongoose          = require('mongoose');
var async             = require('async');
var _                 = require('lodash');
var fs                = require('fs');
var Group             = require('../group/group.model');
var User              = require('../user/user.model');
var GoogleAPIKey      = process.env.GOOGLE_API_KEY;
var SENDGRID_API_KEY  = process.env.SENDGRID_API_KEY;
var sendgrid          = require('sendgrid')(SENDGRID_API_KEY);
var date              = new Date();

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

var homelessMoveinDescription = "Someone just moved off the streets and it’s time to party! This person now lives in your selected volunteer area and you can help make a difference by welcoming them home! Simply, select organize cause and it will send the invites to the rest of your group." +
"You will also be responsible for putting together a Welcome Home Kit. Make sure to tell each member what they are responsible for. And get ready to party!";

var homelessVolunteerMoveIn =   "Someone just moved off the streets and it’s time to party! This person now lives in your area and you can help make a difference by welcoming them home!";

var checkEventName = function(event){
    if(event.firstName){
        return event.firstName.capitalize();
    }
    else if(!event.firstName && event.organizerFirstName){
        return event.organizerFirstName.capitalize();
    }
    else{
        return "";
    }
};


var sendEmail = function() {
    var email = new sendgrid.Email({
        to: 'gobethe1dev@gmail.com',
        from: 'gobethe1dev@gmail.com',
        subject: 'Testing testing 1.3.3',
        html: '<h1></h1>',
    });
    email.addFilter('templates', 'template_id', 'bc764a16-9e00-4cae-b42e-5e6fb11d282f');
    email.addSubstitution("%date%", date)

    sendgrid.send(email, function(err, json) {
     if (err) { return console.error(err); }
     console.log(json);
    });
}

function matchZipCodeSendgrid(event, host){

  async.waterfall([
      function(done) {
        Group.find({ matchZipCodeArr: {$elemMatch: {$eq: event.zipCode} }}, function(err, group) {
          if (!group) {
            // console.log(err)
            // return res.status(404).send('There are no zipcode matches.');
          }
           done(err, group);
        });
      },
      function(group, done) {

        group.map(function(value){

            var link = 'http://' + host + '/confirm/' + event._id + '/' + value._id;
            var capFirstName = _.capitalize(value.firstName);
            var eventName = _.capitalize(event.firstName) || _.capitalize(event.eventName);
            var eventDescription = event.description  || homelessMoveinDescription;
            var mapLink = 'http://maps.googleapis.com/maps/api/staticmap?center=' + event.zipCode + '&zoom=14&size=800x300&markers=' + event.zipCode + '&key=' + GoogleAPIKey
            console.log("email", value.email)

            var email = new sendgrid.Email({
                to: value.email,
                from: 'gobethe1dev@gmail.com',
                subject: 'Are You Available? TEST',
                html: '<h1></h1>',
            });

            console.log("capFirstName")
            console.log(capFirstName)

            email.addFilter('templates', 'template_id', 'bc764a16-9e00-4cae-b42e-5e6fb11d282f');
            email.setSubstitutions({"%capFirstName%": [capFirstName], "%eventName%": [eventName], "%link%":[link], "%eventDescription%": [eventDescription] })

            sendgrid.send(email, function(err, json) {
             if (err) { return console.error(err); }
             console.log(json);
            });


        });

        done('done');


      },
    ], function(err) {
      if (err) return (err);
    });
}

module.exports.sendEmail = sendEmail;
module.exports.matchZipCodeSendgrid = matchZipCodeSendgrid
