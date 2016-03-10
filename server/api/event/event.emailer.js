'use strict';

var mongoose = require('mongoose');
var async = require('async');
var _     = require('lodash');
var fs    = require('fs');
var Group = require('../group/group.model');
var User = require('../user/user.model');
var nodemailer = require('nodemailer');
var GodaddyPassword = process.env.GODADDY_PASSWORD;
var GodaddySMTP = process.env.GODADDY_SMTP;
var GoogleAPIKey = process.env.GOOGLE_API_KEY;

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

function matchZipCode(event, host){

  async.waterfall([
	  function(done) {
	    Group.find({ zipCode: event.zipCode }, function(err, group) {
	      if (!group) {
	      	// console.log(err)
	        // return res.status(404).send('There are no zipcode matches.');
	      }
	       done(err, group);
	    });
	  },
	  function(group, done) {

	    group.map(function(value){

	    	var index = _.indexOf(event.sentEmails, value.email)

	    	var link = 'http://' + host + '/event/' + event._id + '/confirm/' + value._id;
	    	var capFirstName = _.capitalize(value.firstName);
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
		      to:  value.email,
		      from: 'hello@gobethe1.com',
		      subject: 'Are You Available?',
		      html:  '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr>' +
		    '<td align="center">' +
		    '<img src=' + mapLink + '>' +
		    '<h5 style="font-size:16px;font-family:sans-serif;">Hello ' + capFirstName + ', we matched you with a move-in party of a homeless vet in your neighborhood!</h5>' +
		    '<h5 style="font-size:16px;font-family:sans-serif;">Check out the dates and times and let us know if you are available:</h5>' +
		    '<a href=' + link +  ' style="background-color:#0700FC;border:1px solid #0700FC ;border-radius:3px;color:#ffffff ;display:inline-block;font-family:sans-serif;font-size:16px;line-height:44px;text-align:center;text-decoration:none;width:150px;-webkit-text-size-adjust:none;mso-hide:all;">View Party Dates</a></td>' +
		    '</tr></table>'

		    };

			if(index === -1){
			    transporter.sendMail(mailOptions, function(err) {
			    	console.log("inside sendMail error")
			    	console.log(err)
			    	console.log(mailOptions.to)
			      // return res.status(200).send('An e-mail has been sent to ' + user.email + ' with further instructions.');
			    });
			}

		});

	    done('done');


	  },
	], function(err) {
	  if (err) return (err);
	});
}

function confirmGroup(event){
		  console.log("confirmGroup")
		  console.log(event.confirmGroup)
		  async.waterfall([
			  function(done) {
			    Group.findById( event.confirmGroup, function(err, group) {
			      if (!group) {
			      	console.log(err)
			        // return res.status(404).send('There are no zipcode matches.');
			      }
			       console.log("waterfall group")
			       console.log(group)
			       done(err, group);
			    });
			  },
			  function(group, done){
			  	User.findById( event.userId, function(err, user) {
			  		if (!user) {
			      	console.log(err)
			        // return res.status(404).send('There are no zipcode matches.');
			      }

			       done(err, user, group);
			  	});
			  },
			  function(user, group, done) {

			  	      var groupContact = user.email;
			  	    	var capFirstName = _.capitalize(event.firstName);
			  	    	var capLastName = _.capitalize(event.lastName);
			  	    	var dateString = event.confirmDate.toString()
			  	      	var finalDate = dateString.slice(0, 10)
			  	      	var capOrgName = group.organizationName.capitalize();

			  		    var transporter = nodemailer.createTransport({
			  		      host: GodaddySMTP,
			  		      port: 25,
			  		      auth: {
			  		        user: 'hello@gobethe1.com',
			  		        pass: GodaddyPassword
			  		      }
			  		    });

			  		    var mailOptions = {
			  		      to: groupContact, //admin annie email
			  		      from: 'hello@gobethe1.com',
			  		      subject: capFirstName + '\'s Move-In Party',
			  		      html:  '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr>' +
			  		    '<td>' +
			  		    '<p style="font-size:14px;font-family:sans-serif;">We\'ve got a match! The ' + capOrgName + ', have confirmed their attendance</p>' +
			  		    '<p style="font-size:14px;font-family:sans-serif;">for the move-in party of <span style="text-transform:underline">' + capFirstName + ' ' + capLastName + ' </span>' +
			  		    'on <span style="font-weight:bold">' + finalDate + ' from ' + event.confirmTime + '</span>.</p>' +
			  		 		'<p style="font-size:14px;font-family:sans-serif;">Party on,</p>' +
			  		 		'<img src="cid:confirmlogo">' +
			  		 		'</td>' +
			  		    '</tr></table>',
			  		    attachments:[{
			  		    	filename: 'confirm-email-logo.png',
			  		    	path: './client/assets/images/confirm-email-logo.png',
			  		    	cid: 'confirmlogo'
			  		    }]

			  		    };

			  		    transporter.sendMail(mailOptions, function(err) {
			  		    	console.log("inside sendMail error")
			  		    	console.log(err)
			  		      // return res.status(200).send('An e-mail has been sent to ' + user.email + ' with further instructions.');
			  		    });

			    done('done');


			  },
			], function(err) {
			  if (err) return (err);
			});

}

module.exports.confirmGroup = confirmGroup;
module.exports.matchZipCode = matchZipCode;
