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

}


//ORIGINAL MATCHZIPCODE FN
// function matchZipCode(event, host){

//   async.waterfall([
// 	  function(done) {
// 	    Group.find({ zipCode: event.zipCode }, function(err, group) {
// 	      if (!group) {
// 	      	// console.log(err)
// 	        // return res.status(404).send('There are no zipcode matches.');
// 	      }
// 	       done(err, group);
// 	    });
// 	  },
// 	  function(group, done) {

// 	    group.map(function(value){

// 	    	// var index = _.indexOf(event.sentEmails, value.email)

// 	    	var link = 'http://' + host + '/confirm/' + event._id + '/' + value._id;
// 	    	var capFirstName = _.capitalize(value.firstName);
// 	    	var mapLink = 'http://maps.googleapis.com/maps/api/staticmap?center=' + event.zipCode + '&zoom=14&size=800x300&markers=' + event.zipCode + '&key=' + GoogleAPIKey

// 		    var transporter = nodemailer.createTransport({
// 		      host: GodaddySMTP,
// 		      port: 25,
// 		      auth: {
// 		        user: 'hello@gobethe1.com',
// 		        pass: GodaddyPassword
// 		      }
// 		    });

// 		    var mailOptions = {
// 		      to:  value.email,
// 		      from: 'hello@gobethe1.com',
// 		      subject: 'Are You Available?',
// 		      html:
// 		         '<table width="100%" border="0" cellspacing="0" cellpadding="0">' +
// 				     '<tr>' +
// 				     '<td align="center"><img src="https://s3-us-west-1.amazonaws.com/gobethe1-prod/confirm-email-logo.png"><br>' +
// 				     '<img src=' + mapLink + '></td><br>' +
// 				     '</tr>' +
// 				     '<tr>' +
// 				     '<td align="left" valign="top">' +
// 				     '<p style="font-size:14px;font-family:sans-serif;">Hello ' + capFirstName + ',<br>' +
// 				     'We matched you with a move-in party of a homeless vet in your neighborhood! Check out the dates ' +
// 				     'and times and let us know if you are available:</p>' +
// 				     '<div style="text-align:center"><a href=' + link +  ' style="background-color:#4A90E2;border:1px solid #4A90E2;border-radius:5px;color:#ffffff ;display:inline-block;font-family:sans-serif;font-size:16px;line-height:44px;text-decoration:none;width:150px;-webkit-text-size-adjust:none;mso-hide:all;">View Party Dates</a></div><br>' +
// 				     '<p style="font-size:14px;font-family:sans-serif;font-weight:bold;">What\'s this invite about?</p>' +
// 						 '<p style="font-size:14px;font-family:sans-serif">Someone just moved off the streets and it\'s' +
// 						 'time to party! This person now lives in your area and you have been invited to help welcome them home! Ready to make a difference? ' +
// 						 'Simply, accept the invite and start recruiting your friends.</p>' +
// 						 '<p style="font-size:14px;font-family:sans-serif;">We hope to see you there,</p>' +
// 			       '<p style="font-size:14px;font-family:sans-serif;">GOBE team</p>' +
// 						 '</td>' +
// 				     '</tr></table>'
// 		    };

// 			// if(index === -1){
// 			    transporter.sendMail(mailOptions, function(err) {
// 			    	console.log("inside sendMail error")
// 			    	console.log(err)
// 			    	console.log(mailOptions.to)
// 			      // return res.status(200).send('An e-mail has been sent to ' + user.email + ' with further instructions.');
// 			    });
// 			// }

// 		});

// 	    done('done');


// 	  },
// 	], function(err) {
// 	  if (err) return (err);
// 	});
// }
//END ORIGINAL MATCHZIPCODE FN

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

	  	  var dateString 				= event.confirmDate.toString();
	  	  var clientFirstName 	= event.firstName.capitalize();
	  	  var eventAddress 			= event.address;
		  var capFirstName 			= _.capitalize(group.firstName);
	  	  var capLastName 			= _.capitalize(group.lastName);
	  	  var finalDate 				= dateString.slice(0, 10);
	  	  var capOrgName 				= group.organizationName.capitalize();
	  	  var groupPhoneNumber 	= group.phoneNumber;
	  	  var gobeKitLink				= 'https://s3-us-west-1.amazonaws.com/gobethe1-prod/welcome-kit.pdf';
	  	  var gobeInstagram 		= 'https://www.instagram.com/gobethe1/';

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
			  	// detailsToGroupLeader(event, host);
			  	// volunteerMatch(event, host);
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

	    	// var link = 'http://' + host + '/confirm/' + event._id + '/' + value._id;
	    	// var capFirstName = _.capitalize(value.firstName);
	    	// var mapLink = 'http://maps.googleapis.com/maps/api/staticmap?center=' + event.zipCode + '&zoom=14&size=800x300&markers=' + event.zipCode + '&key=' + GoogleAPIKey

						var groupContact = group.email;
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
			  		      to: groupContact, //admin annie email
			  		      from: 'hello@gobethe1.com',
			  		      subject: capFirstName + '\'s Move-In Party',
			  		      html:
		  		      		'<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr>' +
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
		      			    '<p style="font-size:14px;font-family:sans-serif">Check out instagram <a href="https://www.instagram.com/gobethe1/" target="_blank">@GOBETHE1</a> for good ideas' +
		      			   	'from previous parties. Try to think of things you typically find' +
		      			   	'at a party like food and drinks. Things such as welcome home banners' +
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
