'use strict';

var mongoose = require('mongoose');
var async = require('async');
var _     = require('lodash');
var Event = require('../event/event.model');
var nodemailer = require('nodemailer');
var GodaddyPassword = process.env.GODADDY_PASSWORD;
var GodaddySMTP = process.env.GODADDY_SMTP;

function matchZipCode(group, host){
		
	 async.waterfall([
	   function(done) {
	     Event.find({ zipCode: group.zipCode, confirmGroup:null }, function(err, event) {
	       if (!event) {
	       	 console.log(err)
	       	 console.log("no zipcode matches")
	         // return res.status(404).send('There are no zipcode matches.');
	       }
	        done(err, event);
	     });
	   },
	   function(event, done) {

	     event.map(function(event){

	     	// var index = _.indexOf(event.sentEmails, value.email)

	     	var link = 'http://' + host + '/event/' + event._id + '/confirm/' + group._id;
	     	var capFirstName = _.capitalize(group.firstName);

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
		       html:  '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr>' +
		     '<td align="center"><h5 style="font-size:16px;font-family:sans-serif;">Hello ' + capFirstName + ', we matched you with a move-in party of a homeless vet in your neighborhood!</h5>' +
		     '<h5 style="font-size:16px;font-family:sans-serif;">Check out the dates and times and let us know if you are available:</h5>' +
		     '<a href=' + link +  ' style="background-color:#0700FC;border:1px solid #0700FC ;border-radius:3px;color:#ffffff ;display:inline-block;font-family:sans-serif;font-size:16px;line-height:44px;text-align:center;text-decoration:none;width:150px;-webkit-text-size-adjust:none;mso-hide:all;">View Party Dates</a></td>' +
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
