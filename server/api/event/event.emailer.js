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
var gobeKitLink				= 'https://s3-us-west-1.amazonaws.com/gobethe1-prod/welcome-kit.pdf';
var gobeInstagram 		= 'https://www.instagram.com/gobethe1/';

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};



function matchZipCode(event, host){

  async.waterfall([
	  function(done) {
	  	console.log("hitting waterfall")

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
		      html:
		         '<table width="100%" border="0" cellspacing="0" cellpadding="0">' +
				     '<tr>' +
				     '<td align="center"><img src="https://s3-us-west-1.amazonaws.com/gobethe1-prod/confirm-email-logo.png"><br>' +
				     '<img src=' + mapLink + '></td><br>' +
				     '</tr>' +
				     '<tr>' +
				     '<td align="left" valign="top">' +
				     '<p style="font-size:14px;font-family:sans-serif;">Hello ' + capFirstName + ',<br>' +
				     'We matched you with a move-in party of a homeless vet in your neighborhood! Check out the dates ' +
				     'and times and let us know if you are available:</p>' +
				     '<div style="text-align:center"><a href=' + link +  ' style="background-color:#4A90E2;border:1px solid #4A90E2;border-radius:5px;color:#ffffff ;display:inline-block;font-family:sans-serif;font-size:16px;line-height:44px;text-decoration:none;width:150px;-webkit-text-size-adjust:none;mso-hide:all;">View Party Dates</a></div><br>' +
				     '<p style="font-size:14px;font-family:sans-serif;font-weight:bold;">What\'s this invite about?</p>' +
						 '<p style="font-size:14px;font-family:sans-serif">Someone just moved off the streets and it\'s ' +
						 'time to party! This person now lives in your area and you have been invited to help welcome them home! Ready to make a difference? ' +
						 ' Simply, accept the invite and start recruiting your friends.</p>' +
						 '<p style="font-size:14px;font-family:sans-serif;">We hope to see you there,</p>' +
			       '<p style="font-size:14px;font-family:sans-serif;">GOBE team</p>' +
						 '</td>' +
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

	  	  var dateString = event.confirmDate.toString();
	  	  var clientFirstName = event.firstName.capitalize();
	  	  var eventAddress = event.address;
		  var capFirstName = _.capitalize(group.firstName);
	  	  var capLastName = _.capitalize(group.lastName);
	  	  var finalDate = dateString.slice(0, 10);
	  	  var capOrgName = group.organizationName.capitalize();
	  	  var number = group.phoneNumber.toString();
	  	  var groupPhoneNumber  = '(' + number.substring(0,3) + ')' + number.substring(3,6) + '-' + number.substring(6,10);
	  	  var gobeKitLink = 'https://s3-us-west-1.amazonaws.com/gobethe1-prod/welcome-kit.pdf';
	  	  var gobeInstagram = 'https://www.instagram.com/gobethe1/';


		    group.emailList.map(function(value){

		    	var linkConfirm = 'http://' + host + '/confirm/volunteer/' + group._id + '/'+ event._id + '/' + value + '/yes';
		    	var linkReject =  'http://' + host + '/confirm/volunteer/' + group._id + '/'+ event._id + '/' + value + '/no';

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
			      html:
			      	// gobe logo
			      	'<img style="display:block;margin:0 auto"src="https://s3-us-west-1.amazonaws.com/gobethe1-prod/confirm-email-logo.png"><br>' +

			      	// initial tag-line + details
			      	'<p> Get ready to party! </p>' +
			      	'<p style="font-size:14px;font-family:sans-serif;font-weight:bold"> Details </p>' +
					    '<p> The ' + capOrgName + ' are confirmed for the ' +
					    'move-in party of ' + clientFirstName + ' on ' + finalDate + ' at ' + event.confirmTime + '.</p>' +

					    // event information
					    '<p style="font-size:14px;font-family:sans-serif;font-weight:bold"> Event Information </p>' +
					    '<p> Point person name: ' + capFirstName + ' ' + capLastName + '<br>' +
					    'Point person phone: ' + groupPhoneNumber + '<br>' +
					    'Event address: ' + eventAddress + ' </p>' +

					    // meetup address
					    '<p style="font-size:14px;font-family:sans-serif;font-weight:bold"> Meet up with your group at this address:</p>' +
					    '<p>' + event.meetupAddress + '<p>' +
					    '<br>' +
					    '<p> From the meetup spot ' + capFirstName + ', your group leader, will direct you to the event</p>' +

					    // what to bring section
					    '<p style="font-size:14px;font-family:sans-serif;font-weight:bold"> What to bring? </p>' +
					    '<p>You can download the checklist of items that complete a <a href=' + gobeKitLink + '>' +
					    'GOBE Welcome Home Kit</a>, but make sure to coordinate with your group leader to see what is still needed! ' +
					    'We encourage you to bring as many items as you would like, but we ask that you please bring the items on this ' +
					    'list as a minimum. All items except pillows can be lightly used. </p>' +

					    // some nice touches sectionc
					    '<p style="font-size:14px;font-family:sans-serif;font-weight:bold"> Some nice touches </p>' +
					    '<p>Keep in mind it\'s a party! Throwing in extra touches such as dessert and/or a welcome home ' +
					    'sign or banner make each move-in personal and special. Need some ideas? Check out our instagram ' +
					    '<a href='+ gobeInstagram +'>@gobethe1</a> for pictures of previous parties. Don\'t forget to take ' +
					    'your own pictures and tag us #gobethe1.</p>' +

					    // sign off
					    '<p> See you there, <br><br>' +
					    'GOBE Team </p>'
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

function detailsToEventCreator(event, host){

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

			  	      var eventContact = user.email;
			  	      var capFirstName = _.capitalize(event.firstName);
			  	      var capLastName = _.capitalize(event.lastName);
			  	      var dateString = event.confirmDate.toString();
			  	      var finalDate = dateString.slice(0, 10);
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
			  		      to: eventContact, //admin annie email
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

			    done('done');


			  },
			], function(err) {
			  if (err) return (err);
			});
}

function detailsToGroupLeader(event, host){

	  async.waterfall([
	  function(done) {
	    Group.findById(event.confirmGroup, function(err, group) {
	      if (!group) {
	      	// console.log(err)
	        // return res.status(404).send('There are no zipcode matches.');
	      }
	       done(err, group);
	    });
	  },
	  function(group, done) {
	    	// var index = _.indexOf(event.sentEmails, value.email)

					  var groupContact = group.email;
			  	      var capFirstName = _.capitalize(event.firstName);
			  	      var capLastName = _.capitalize(event.lastName);
			  	      var dateString = event.confirmDate.toString();
			  	      var finalDate = dateString.slice(0, 10);
			  	      var capOrgName = group.organizationName.capitalize();
			  	      var number = event.phoneNumber.toString();
	  	  			  var clientPhoneNumber = '(' + number.substring(0,3) + ')' + number.substring(3,6) + '-' + number.substring(6,10);
			  	      var eventAddress = event.address;

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
			  		      html:
					  		  // gobe logo
					      	'<img style="display:block;margin:0 auto"src="https://s3-us-west-1.amazonaws.com/gobethe1-prod/confirm-email-logo.png"><br>' +

					      	// initial tag-line + details
					      	'<p> Get ready to party! </p>' +
					      	'<p style="font-size:14px;font-family:sans-serif;font-weight:bold"> Details </p>' +
							    '<p> The ' + capOrgName + ' are confirmed for the ' +
							    'move-in party of ' + capFirstName + ' on ' + finalDate + ' at ' + event.confirmTime + '.</p>' +

							    // event information
							    '<p style="font-size:14px;font-family:sans-serif;font-weight:bold"> Event Information </p>' +
							    '<p> Name: ' + capFirstName + ' ' + capLastName + '<br>' +
							    'Phone: ' + clientPhoneNumber + '<br>' +
							    'Event address: ' + eventAddress + ' </p>' +

							    //meetup address
							     '<p style="font-size:14px;font-family:sans-serif;font-weight:bold">Address where the group will meet</p>' +
							    '<p>' + event.meetupAddress + '</p>' +

							    // what to bring section
							    '<p style="font-size:14px;font-family:sans-serif;font-weight:bold"> What to bring? </p>' +
							    '<p>You can download the checklist of items that complete a <a href=' + gobeKitLink + '>' +
							    'GOBE Welcome Home Kit</a>, but make sure to coordinate with your group leader to see what is still needed! ' +
							    'We encourage you to bring as many items as you would like, but we ask that you please bring the items on this ' +
							    'list as a minimum. All items except pillows can be lightly used. </p>' +

							    // some nice touches sectionc
							    '<p style="font-size:14px;font-family:sans-serif;font-weight:bold"> Some nice touches </p>' +
							    '<p>Keep in mind it\'s a party! Throwing in extra touches such as dessert and/or a welcome home ' +
							    'sign or banner make each move-in personal and special. Need some ideas? Check out our instagram ' +
							    '<a href='+ gobeInstagram +'>@gobethe1</a> for pictures of previous parties. Don\'t forget to take ' +
							    'your own pictures and tag us #gobethe1.</p>' +

							    // sign off
							    '<p> See you there, <br><br>' +
							    'GOBE Team </p>'

			  		    };

  				transporter.sendMail(mailOptions, function(err) {
  		    	console.log("inside sendMail error")
  		    	console.log(err)
  		    	console.log(mailOptions.to)
  		      // return res.status(200).send('An e-mail has been sent to ' + user.email + ' with further instructions.');
  		    });

			  	detailsToEventCreator(event, host);
			  	volunteerMatch(event, host);
	    		done('done');

	  },
	], function(err) {
	  if (err) return (err);
	});
}

module.exports.detailsToGroupLeader = detailsToGroupLeader;
module.exports.volunteerMatch = volunteerMatch;
module.exports.detailsToEventCreator = detailsToEventCreator;
module.exports.matchZipCode = matchZipCode;
