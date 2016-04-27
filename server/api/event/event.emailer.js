'use strict';

var mongoose 					= require('mongoose');
var async 						= require('async');
var _     						= require('lodash');
var fs    						= require('fs');
var Group 						= require('../group/group.model');
var User 							= require('../user/user.model');
var nodemailer 				= require('nodemailer');
var GodaddyPassword 	= process.env.GODADDY_PASSWORD;
var GodaddySMTP 			= process.env.GODADDY_SMTP;
var GoogleAPIKey 			= process.env.GOOGLE_API_KEY;
// var SENDGRID_API_KEY 	= process.env.SENDGRID_API_KEY;
// var sendgrid  				= require('sendgrid')('SENDGRID_API_KEY');
// var email 						= new sendgrid.Email();

<<<<<<< HEAD
sendgrid.send(email);
=======
>>>>>>> 71de95830c4f516add083ad92f78bfc5d992d5f2
var gobeKitLink				= 'https://s3-us-west-1.amazonaws.com/gobethe1-prod/welcome-kit.pdf';
var gobeInstagram 		= 'https://www.instagram.com/gobethe1/';

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

var homelessMoveinDescription = "Someone just moved off the streets and it’s time to party! This person now lives in your selected volunteer area and you can help make a difference by welcoming them home! Simply, select organize cause and it will send the invites to the rest of your group." +
"You will also be responsible for putting together a Welcome Home Kit. Make sure to tell each member what they are responsible for. And get ready to party!";

var homelessVolunteerMoveIn =	"Someone just moved off the streets and it’s time to party! This person now lives in your area and you can help make a difference by welcoming them home!";

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


function matchZipCode(event, host){

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

	    	// var index = _.indexOf(event.sentEmails, value.email)

	    	var link = 'http://' + host + '/confirm/' + event._id + '/' + value._id;
	    	var capFirstName = _.capitalize(value.firstName);
	    	var eventName = _.capitalize(event.firstName) || _.capitalize(event.eventName);
	    	var eventDescription = event.description  || homelessMoveinDescription;
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
		      	 // gobe logo
			       '<img style="display:block;margin:0 auto"src="https://s3-us-west-1.amazonaws.com/gobethe1-prod/confirm-email-logo.png"><br>' +

			       // salutation + invite
				     '<p style="font-size:14px;font-family:sans-serif;">Hello ' + capFirstName + ',<br>' +
				     'You have a new opportunity to make a difference! ' + eventName + ' needs help in your area.' +

				     // view dates button
				     '<div style="text-align:center"><a href=' + link +  ' style="background-color:#4A90E2;border:1px solid #4A90E2;border-radius:5px;color:#ffffff ;display:inline-block;font-family:sans-serif;font-size:16px;line-height:44px;text-decoration:none;width:150px;-webkit-text-size-adjust:none;mso-hide:all;">View Event Dates</a></div><br>' +

				     // what's this about?
				     '<p style="font-size:14px;font-family:sans-serif;font-weight:bold">What\'s this invite about?</p>' +
				     '<p>' + eventDescription + ' </p>' +
						 '<p>Ready to make a difference? Simply accept the invite and start recruiting your friends.' +

				 // sign off
				 '<p>We hope to see you there,<br>' +
			       'GoBe team</p>'
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


	  	  var dateString 				= event.confirmDate.toString();
	  	  var clientFirstName 	= checkEventName(event);
	  	  var eventAddress 			= event.address;
		  var capFirstName 			= _.capitalize(group.firstName);
	  	  var capLastName 			= _.capitalize(group.lastName);
	  	  var finalDate 				= dateString.slice(0, 10);
	  	  var date 							= new Date(event.confirmDate);
	  	  var capOrgName 				= group.organizationName.capitalize();
	  	  var groupLeader 			= group.firstName;
	  	  var number 						= group.phoneNumber.toString();
	  	  var groupPhoneNumber  = '(' + number.substring(0,3) + ')' + number.substring(3,6) + '-' + number.substring(6,10);
	  	  var eventName 				= _.capitalize(event.firstName || event.eventName);
	  	  var eventDescription  = event.description || homelessVolunteerMoveIn;


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
			      	'<p> You have been invited by ' + groupLeader + ' to join the rest of ' + capOrgName + ' to help ' + eventName +
			      	' in your area on ' + finalDate + ' at ' + event.confirmTime + '. Can you make it?</p>' +

					    // can you make it?
					   	'<a href=' + linkConfirm +  ' style="background-color:#4A90E2;border:1px solid #4A90E2;border-radius:5px;color:#ffffff ;display:inline-block;font-family:sans-serif;font-size:14px;line-height:44px;text-align:center;text-decoration:none;width:40%;-webkit-text-size-adjust:none;mso-hide:all;">Yes, I\'ll be there</a><br><br>' +
					    '<a href=' + linkReject +  '  style="text-decoration:underline;color:black;font-size:14px;">I can\'t make it</a><br><br>' +

					    // some this about?
					    '<p style="font-size:14px;font-family:sans-serif;font-weight:bold"> What\'s this invite about? </p>' +
					    '<p>' + eventDescription + '</p>' +

					    // sign off
					    '<p> Hope to see you there, <br>' +
					    'GoBe Team </p>'
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
			  		//console.log(user)
			       done(err, user, group);
			  	});
			  },
			  function(user, group, done) {

			  	      var eventContact = user.email;
			  	      // var capFirstName = _.capitalize(event.firstName);
			  	      // var capLastName = _.capitalize(event.lastName);
			  	      var dateString = event.confirmDate.toString();
			  	      var finalDate = dateString.slice(0, 10);
			  	      var capOrgName = group.organizationName.capitalize();
			  	      var eventName = event.eventName || event.firstName;
			  	      var eventTime = event.confirmTime;

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
			  		      subject: eventName + ' has been matched!',
 			  		      html:
 			  		      // gobe logo
 			  		      '<img style="display:block;margin:0 auto"src="https://s3-us-west-1.amazonaws.com/gobethe1-prod/confirm-email-logo.png"><br>' +

 			  		      // match text
 			  		      '<p> We\'ve got a match! The ' + capOrgName + ', have confirmed ' +
 			  		      'their attendance for ' + eventName + ' on ' + finalDate +
 			  		      ' at ' + eventTime + '. </p>'
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

					  var groupContact 		= group.email;
			  	      var dateString 		= event.confirmDate.toString();
			  	      var finalDate 		= dateString.slice(0,10);
			  	      var capOrgName 		= group.organizationName.capitalize();
			  	      var number 			= event.organizerPhoneNumber.toString() || event.phoneNumber.toString();
	  	  			  var clientPhoneNumber = '(' + number.substring(0,3) + ') ' + number.substring(3,6) + '-' + number.substring(6,10);
	  	  			  var phoneNumber 		= clientPhoneNumber || organizerPhoneNumber;
			  	      var eventAddress 		= event.address;
			  	      var eventName 		= event.eventName || event.firstName;
			  	      var eventTime 		= event.confirmTime;
			  	      var eventMeetup 		= event.meetupAddress;
			  	      var eventDescription 	= event.description  || homelessMoveinDescription;
			  	      var eventRegistryUrl 	= event.registryUrl
			  	      var eventNotes  		= event.notes || "";
			  	      var organizerFirstName = event.organizerFirstName;
			  	      var organizerLastName = event.organizerLastName;
			  	      var organizerPhoneNumber = event.organizerPhoneNumber;
			  	      var organizerEmail 	= event.organizerEmail

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
			  		      subject: eventName + ' Details',
			  		      html:
					  		  // gobe logo
					      	'<img style="display:block;margin:0 auto"src="https://s3-us-west-1.amazonaws.com/gobethe1-prod/confirm-email-logo.png"><br>' +

					      	// initial tag-line + details
					      	'<p> Thank you for being a changemaker!</p>' +
					      	'<p style="font-size:14px;font-family:sans-serif;font-weight:bold"> Details: </p>' +
							    '<p> The ' + capOrgName + ' are confirmed for ' + eventName + ' on ' + finalDate +
							    ' at ' + eventTime + '.</p>' +

							    // event information
							    '<p style="font-size:14px;font-family:sans-serif;font-weight:bold"> Event Information: </p>' +
							    '<p> Event Name: ' + eventName + '<br>' +
							    'Phone: ' + phoneNumber + '<br>' +
							    'Event address: ' + eventAddress + ' </p>' +

							    //meetup address
							    '<p style="font-size:14px;font-family:sans-serif;font-weight:bold">Address where the group will meet:</p>' +
							    '<p>' + eventMeetup + '</p>' +

							    // what to bring section
							    '<p style="font-size:14px;font-family:sans-serif;font-weight:bold"> What to know: </p>' +
							    '<p>' + eventDescription + '</p>' +

							    // registry link
							    '<p style="font-size:14px;font-family:sans-serif;font-weight:bold">More info: </p>' +
							    '<p><a href=' + eventRegistryUrl + '>Event Link</a> <br>' + eventNotes  + '</p>' +

							    // some nice touches sectionc
							    '<p style="font-size:14px;font-family:sans-serif;font-weight:bold"> Who to contact for questions:</p>' +
							    '<p> Name: ' + organizerFirstName + ' ' + organizerLastName + '<br>' +
							    'Email: ' + organizerEmail + '<br>' +
							    'Phone Number: ' + organizerPhoneNumber + '</p>' +

							    // sign off
							    '<p> See you there, <br>' +
							    'GoBe Team </p>'

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
