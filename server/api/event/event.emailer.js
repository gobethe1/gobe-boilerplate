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
		    '<img src="https://s3-us-west-1.amazonaws.com/gobethe1-prod/confirm-email-logo.png">' +
		    '<img src=' + mapLink + '>' +
		    '<h5 style="font-size:14px;font-family:sans-serif;">Hello ' + capFirstName + ', we matched you with a move-in party of a homeless vet in your neighborhood!</h5>' +
		    '<h5 style="font-size:14px;font-family:sans-serif;">Check out the dates and times and let us know if you are available:</h5>' +
		    '<a href=' + link +  ' style="background-color:#4A90E2;border:1px solid #4A90E2 ;border-radius:5px;color:#ffffff ;display:inline-block;font-family:sans-serif;font-size:16px;line-height:44px;text-align:center;text-decoration:none;width:20%;-webkit-text-size-adjust:none;mso-hide:all;">View Party Dates</a></td>' +
		    '<p style="font-size:14px;font-family:sans-serif;font-weight:bold;">What\'s this invite about?</p>' +
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
		       done(err, group);
		    });
		  },
		  function(group, done) {

		  	var capFirstName = _.capitalize(group.firstName);
	  		var capLastName = _.capitalize(group.lastName);
	  		var dateString = event.confirmDate.toString()
	  	  	var finalDate = dateString.slice(0, 10)
	  	  	var capOrgName = group.organizationName.capitalize();


		  	// console.log("group emailList")
		  	// console.log(group.emailList)

		    group.emailList.map(function(value){
		    	// console.log("email value")
		    	// console.log(value)
		    	// var index = _.indexOf(event.sentEmails, value.email)

		    	var linkConfirm = 'http://' + host + '/confirm/volunteer/' + group._id + '/'+ event._id + '/' + value + '/yes';
		    	var linkReject =  'http://' + host + '/confirm/volunteer/' + group._id + '/'+ event._id + '/' + value + '/no';
		    	// console.log("link")
		    	// console.log(linkConfirm)
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
			    '<a href=' + linkConfirm +  ' style="background-color:#4A90E2;border:1px solid #4A90E2;border-radius:5px;color:#ffffff ;display:inline-block;font-family:sans-serif;font-size:14px;line-height:44px;text-align:center;text-decoration:none;width:40%;-webkit-text-size-adjust:none;mso-hide:all;">Yes, I\'ll be there</a><br><br>' +
			    '<a href=' + linkReject +  '  style="text-decoration:underline;color:black;font-size:14px;">I can\'t make it</a></p></td>' +
			    '<td align="left" width="50%" style="vertical-align:top;">' +
			    '<p style="font-size:14px;font-family:sans-serif;font-weight:bold;">What\'s this invite about?</p>' +
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
			  		      html: '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr>' +
			      			    '<td align="left" width="50%">' +
			      			    '<img src="https://s3-us-west-1.amazonaws.com/gobethe1-prod/confirm-email-logo.png">' +
			      			    '<p style="font-size:16px;font-family:sans-serif;">Get ready to party!</p>' +
			      			    '<p style="font-size:14px;font-family:sans-serif;font-weight:bolder">Details</p>' +
			      			    '<p style="font-size:14px;font-family:sans-serif;">The ' + capOrgName + ' are confirmed for the move in party<br>' +
			      			    'of ' + capFirstName + ' ' + capLastName + ' on  <span style="font-weight:bolder"> ' + finalDate + ' at ' + event.confirmTime + '</span></p>' +
			      			   	'<p style="font-size:14px;font-family:sans-serif;font-weight:bolder">Event Address</p>' +
			      			    '<p style="font-size:14px;font-family:sans-serif;"> ' + event.address + ' </p>' +
			      			    '<p style="font-size:14px;font-family:sans-serif;font-weight:bolder;">What to bring?</p>' +
			      			    '<p style="font-size:14px;font-family:sans-serif;">Download the checklist of items <a href="https://s3-us-west-1.amazonaws.com/gobethe1-prod/welcome-kit.pdf" target="_blank" style="text-decoration:underline;">here</a>. This is a typical <br>' +
			      			    'GOBE Welcome Home Kit. You can bring more but we <br>' +
			      			    'ask you bring this as a minimum. All items except<br>' +
			      			    'pillows can be lightly used.</p>' +
			      			    '<br><p style="font-size:14px;font-family:sans-serif;">See you there,</p>' +
			      			    '<p style="font-size:14px;font-family:sans-serif;">GOBE team</p>' +
			      			    '</td>' +
			      			    '<td align="left" width="50%">' +
			      			    '<p style="font-size:14px;font-family:sans-serif;font-weight:bolder">Some nice touches</p>' +
			      			    '<p style="font-size:14px;font-family:sans-serif">Check out instagram <a href="https://www.instagram.com/gobethe1/" target="_blank">@GOBETHE1</a> for good ideas<br>' +
			      			   	'from previous parties. Try to think of things you typically find <br>' +
			      			   	'at a party like food and drinks. Things such as welcome home banners <br>' +
			      			   	'and posters make each party an extra special event!<p>' +
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
