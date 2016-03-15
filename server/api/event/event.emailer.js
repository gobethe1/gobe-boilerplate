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

	    	// var index = _.indexOf(event.sentEmails, value.email)

	    	var link = 'http://' + host + '/confirm/' + event._id + '/' + value._id;
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

			// if(index === -1){
			    transporter.sendMail(mailOptions, function(err) {
			    	console.log("inside sendMail error")
			    	console.log(err)
			    	console.log(mailOptions.to)
			      // return res.status(200).send('An e-mail has been sent to ' + user.email + ' with further instructions.');
			    });
			// }

		});

	    done('done');


	  },
	], function(err) {
	  if (err) return (err);
	});
}

function volunteerMatch(event, host){

	  async.waterfall([
		  function(done) {
		    Group.findById( event.confirmGroup, function(err, group) {
		      if (!group) {
		      	// console.log(err)
		        // return res.status(404).send('There are no zipcode matches.');
		      }
		       console.log("volunteer group")
		       console.log(group)
		       done(err, group);
		    });
		  },
		  function(group, done) {

		  	var capFirstName = _.capitalize(group.firstName);
	  		var capLastName = _.capitalize(group.lastName);
	  		var dateString = event.confirmDate.toString()
	  	  	var finalDate = dateString.slice(0, 10)
	  	  	var capOrgName = group.organizationName.capitalize();


		  	console.log("group emailList")
		  	console.log(group.emailList)

		    group.emailList.map(function(value){
		    	console.log("email value")
		    	console.log(value)
		    	// var index = _.indexOf(event.sentEmails, value.email)

		    	var linkConfirm = 'http://' + host + '/confirm/volunteer/' + group._id + '/'+ event._id + '/' + value + '/yes';
		    	var linkReject =  'http://' + host + '/confirm/volunteer/' + group._id + '/'+ event._id + '/' + value + '/no';
		    	console.log("link")
		    	console.log(linkConfirm)
			    var transporter = nodemailer.createTransport({
			      host: GodaddySMTP,
			      port: 25,
			      auth: {
			        user: 'hello@gobethe1.com',
			        pass: GodaddyPassword
			      }
			    });

			    var mailOptions = {
			      to:  value, //looping over the email list
			      from: 'hello@gobethe1.com',
			      subject: 'Are you available to volunteer?',
			      html:  '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr>' +
			    '<td align="center" width="50%">' +
			    '<p style="font-size:14px;font-family:sans-serif;">You have been invited by ' + capFirstName + ' ' + capLastName + ' to  <br>' +
			    'join the rest of the ' + capOrgName + ' for the move <br>' +
			    'in party in your area on  <span style="font-weight:bold"> ' + finalDate + ' at ' + event.confirmTime + '</span>. <br>' +
			    'Can you make it? <br><br>' +
			    '<a href=' + linkConfirm +  ' style="background-color:#0700FC;border:1px solid #0700FC ;border-radius:3px;color:#ffffff ;display:inline-block;font-family:sans-serif;font-size:14px;line-height:44px;text-align:center;text-decoration:none;width:150px;-webkit-text-size-adjust:none;mso-hide:all;">Yes, I\'ll be there</a><br><br>' +
			    '<a href=' + linkReject +  '  style="text-decoration:underline;color:black;font-size:14px;">I can\'t make it</a></p></td>' +
			    '<td align="center" width="50%">' +
			    '<p style="font-size:14px;font-family:sans-serif;font-weight:bold">What\'s this invite about?</p>' +
			    '<p style="font-size:14px;font-family:sans-serif">Someone just moved off the streets and it\'s <br>' +
			   	'time to party! This person now lives in your <br>' +
			   	'area and you have been invited to help <br>' +
			   	'welcome them home! Ready to make a difference? <br>' +
			   	'Simply, accept the invite, ask your group leader <br>' +
			   	'what items you can bring, and bring the items <br>' +
			   	'with you to the party!</p></td>' +
			    '</tr></table>'

			    };

				// if(index === -1){
				    transporter.sendMail(mailOptions, function(err) {
				    	console.log("inside sendMail")
				    	console.log(err)
				    	console.log(mailOptions.to)
				      // return res.status(200).send('An e-mail has been sent to ' + user.email + ' with further instructions.');
				    });
				// }

			});

		    done('done');


		  },
		], function(err) {
		  if (err) return (err);
		});

}

function confirmGroup(event, host){
		  // console.log("confirmGroup")
		  // console.log(event.confirmGroup)
		  // console.log('event')
		  // console.log(event)
		  async.waterfall([
			  function(done) {
			    Group.findById( event.confirmGroup, function(err, group) {
			      if (!group) {
			      	console.log(err)
			        // return res.status(404).send('There are no zipcode matches.');
			      }
			       // console.log("waterfall group")
			       // console.log(group)
			       done(err, group);
			    });
			  },
			  function(group, done){
			  	// console.log('user')
			  	User.findById( event.userId, function(err, user) {
			  		// console.log(user)
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
			  		    '<p style="font-size:14px;font-family:sans-serif;">We\'ve got a match! The ' + capOrgName + ', have confirmed their attendance ' +
			  		    'for the <br> move-in party of <span style="text-transform:underline">' + capFirstName + ' ' + capLastName + ' </span>' +
			  		    'on <span style="font-weight:bold">' + finalDate + ' from ' + event.confirmTime + '</span>. </p>' +
			  		 		'<p style="font-size:14px;font-family:sans-serif;">Party on, </p>' +
			  		 		'<img src="https://s3-us-west-1.amazonaws.com/gobethe1-prod/confirm-email-logo.png">' +
			  		 		'</td>' +
			  		    '</tr></table>'
			  		    };

			  		    transporter.sendMail(mailOptions, function(err) {
			  		    	console.log("inside sendMail error")
			  		    	console.log(err)
			  		    	console.log(mailOptions.to)
			  		      // return res.status(200).send('An e-mail has been sent to ' + user.email + ' with further instructions.');
			  		    });

			  	volunteerMatch(event, host);
			    done('done');


			  },
			], function(err) {
			  if (err) return (err);
			});




}

module.exports.volunteerMatch = volunteerMatch;
module.exports.confirmGroup = confirmGroup;
module.exports.matchZipCode = matchZipCode;
