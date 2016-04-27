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

var sendEmail = function() {
    var email = new sendgrid.Email({
        to: 'cassie.purtlebaugh@gmail.com',
        from: 'gobethe1dev@gmail.com',
        subject: 'Testing testing 1.3.3',
        html: '<h1>This is a mofo test. Today\'s date is: ',
        // sub: {'<%date%>': new Date()},
    });
    email.addFilter('templates', 'template_id', 'bc764a16-9e00-4cae-b42e-5e6fb11d282f');
    email.addSubstitution("%date%", date)

    sendgrid.send(email, function(err, json) {
     if (err) { return console.error(err); }
     console.log(json);
    });
};

module.exports.sendEmail = sendEmail;
