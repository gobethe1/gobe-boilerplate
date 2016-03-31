'use strict';

var mongoose = require('mongoose');
var async = require('async');
var _     = require('lodash');
var Event = require('../event/event.model');
var nodemailer = require('nodemailer');
var GodaddyPassword = process.env.GODADDY_PASSWORD;
var GodaddySMTP = process.env.GODADDY_SMTP;
var GoogleAPIKey = process.env.GOOGLE_API_KEY;

function matchZipCode(group, host){

	 async.waterfall([
	   function(done) {
	     Event.find({ zipCode: group.zipCode, confirmGroup:null, causeType: 'Homeless Move-in' }, function(err, event) {
	       if (!event) {
	       	 console.log("no zipcode matches")
	         // return res.status(404).send('There are no zipcode matches.');
	       }
	        // console.log(event)
	        done(err, event);
	     });
	   },
	   function(event, done) {

	     event.map(function(event){

	     	// var index = _.indexOf(event.sentEmails, value.email)

	     	var link = 'http://' + host + '/confirm/' + event._id + '/' + group._id;
	     	var capFirstName = _.capitalize(group.firstName);
	     	var mapLink = 'http://maps.googleapis.com/maps/api/staticmap?center=' + event.zipCode + '&zoom=14&size=800x300&markers=' + event.zipCode + '&key=' + GoogleAPIKey

		     var transporter = nodemailer.createTransport({
		       host: GodaddySMTP,
		       port: 25,
		       auth: {
		         user: 'hello@gobethe1.com',
		         pass: GodaddyPassword
		       }
		     });

		     var mailOptions = {
		       to: group.email,
		       from: 'hello@gobethe1.com',
		       subject: 'Are You Available?',
		       html:
		         '<table width="100%" border="0" cellspacing="0" cellpadding="0">' +
				     '<tr>' +
				     '<td align="center"><img src="https://s3-us-west-1.amazonaws.com/gobethe1-prod/confirm-email-logo.png"><br>' +
				     '<img src=' + mapLink + '></td><br>' +
				     '</tr>' +
				     '<tr>' +
				     '<td align="left" valign="top">' +
				     '<p style="font-size:14px;font-family:sans-serif;">Hello ' + capFirstName + ',<br>' +
				     'we matched you with a move-in party of a homeless vet in your neighborhood! Check out the dates ' +
				     'and times and let us know if you are available:</p>' +
				     '<div style="text-align:center"><a href=' + link +  ' style="background-color:#4A90E2;border:1px solid #4A90E2;border-radius:5px;color:#ffffff ;display:inline-block;font-family:sans-serif;font-size:16px;line-height:44px;text-decoration:none;width:150px;-webkit-text-size-adjust:none;mso-hide:all;">View Party Dates</a></div><br>' +
				     '<p style="font-size:14px;font-family:sans-serif;font-weight:bold;">What\'s this invite about?</p>' +
						 '<p style="font-size:14px;font-family:sans-serif">Someone just moved off the streets and it\'s' +
						 'time to party! This person now lives in your area and you have been invited to help welcome them home! Ready to make a difference?' +
						 'Simply, accept the invite and start recruiting your friends.</p>' +
						 '<p style="font-size:14px;font-family:sans-serif;">We hope to see you there,</p>' +
			       '<p style="font-size:14px;font-family:sans-serif;">GOBE team</p>' +
						 '</td>' +
				     '</tr></table>'
		     };

		 	// if(index === -1){
		 	    transporter.sendMail(mailOptions, function(err) {
		 	    	console.log("inside sendMail error")
		 	    	console.log(mailOptions.to)
		 	      // return res.status(200).send('An e-mail has been sent to ' + user.email + ' with further instructions.');
		 	    });
		 	// }

		 });

	     done('done');


	   },
	 ], function(err, done) {
	   if (err) return (err);
	   console.log("last error")
	   console.log(done)
  });

}

module.exports.matchZipCode = matchZipCode;
