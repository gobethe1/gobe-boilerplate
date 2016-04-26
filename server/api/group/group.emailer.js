'use strict';

var mongoose = require('mongoose');
var async = require('async');
var _     = require('lodash');
var Event = require('../event/event.model');
var nodemailer = require('nodemailer');
var GodaddyPassword = process.env.GODADDY_PASSWORD;
var GodaddySMTP = process.env.GODADDY_SMTP;
var GoogleAPIKey = process.env.GOOGLE_API_KEY;

var homelessMoveinDescription = "Someone just moved off the streets and it’s time to party! This person now lives in your selected volunteer area and you can help make a difference by welcoming them home! Simply, select organize cause and it will send the invites to the rest of your group." +
"You will also be responsible for putting together a Welcome Home Kit. Make sure to tell each member what they are responsible for. And get ready to party!"

var homelessVolunteerMoveIn =	"Someone just moved off the streets and it’s time to party! This person now lives in your area and you can help make a difference by welcoming them home!";


function matchZipCode(group, host){

	 async.waterfall([
	   function(done) {
	     Event.find({zipCode: {$in: group.matchZipCodeArr}, confirmGroup:null},
	     	function(err, event) {
	       if (!event) {
	       	 console.log("no zipcode matches")
	         // return res.status(404).send('There are no zipcode matches.');
	       }
	        done(err, event);
	     });
	   },
	   function(event, done) {

	     event.map(function(event){

	     	// var index = _.indexOf(event.sentEmails, value.email)

	     	var link = 'http://' + host + '/confirm/' + event._id + '/' + group._id;
	     	var capFirstName = _.capitalize(group.firstName);
	     	var mapLink = 'http://maps.googleapis.com/maps/api/staticmap?center=' + event.zipCode + '&zoom=14&size=800x300&markers=' + event.zipCode + '&key=' + GoogleAPIKey
	     	var eventDescription = event.description ||  homelessMoveinDescription;
	     	var eventName = _.capitalize(event.firstName) || _.capitalize(event.eventName);

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
		      	 // gobe logo
			       '<img style="display:block;margin:0 auto"src="https://s3-us-west-1.amazonaws.com/gobethe1-prod/confirm-email-logo.png"><br>' +

			       // salutation + invite
				     '<p style="font-size:14px;font-family:sans-serif;">Hello ' + capFirstName + ', <br>' +
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

function updatedVolunteerMatch(group, host){
		console.log("hitting updatedVolunteerMatch")
		 async.waterfall([

		   function(done) {
		     Event.find({confirmGroup: group._id, confirmDate: {$gte: new Date()}},
		     	function(err, event) {
		       if (!event) {
		       	 console.log("no zipcode matches")
		         // return res.status(404).send('There are no zipcode matches.');
		       }
		       	console.log("updatedVolunteerMatch events", event)
		        done(err, event);
		     });
		   },
		function(event, done) {

				var previousEmailListArr = group.previousEmailList;
				var currentEmailListArr = group.emailList;
				var emailerListArr 		= _.difference(currentEmailListArr, previousEmailListArr)

	  		console.log("previousEmailListArr", previousEmailListArr)
				console.log("currentEmailListArr", currentEmailListArr)
				console.log("emailerListArr", emailerListArr)

		  			var capFirstName = _.capitalize(group.firstName);
	  	  		var capLastName = _.capitalize(group.lastName);
	  	  		var groupLeader = group.firstName;
		  	  	var capOrgName = group.organizationName.capitalize();
	  		  	var number = group.phoneNumber.toString();
		  	  	var groupPhoneNumber  = '(' + number.substring(0,3) + ')' + number.substring(3,6) + '-' + number.substring(6,10);
	  	  	    // var gobeKitLink = 'https://s3-us-west-1.amazonaws.com/gobethe1-prod/welcome-kit.pdf';
	  	  		// var gobeInstagram = 'https://www.instagram.com/gobethe1/';

	  	  		_.forEach(event, function(value){
				    console.log("forEach event", value)

				    	emailerListArr.map(function(email){
					    	console.log("hitting emailerListArr map")
					    	console.log("emailerListArr", email)

					    	var dateString 						= value.confirmDate.toString();
		  	  			var finalDate 						= dateString.slice(0, 10);
		  	  			var clientFirstName	     	= value.firstName.capitalize();
		  	  			var eventAddress 					= value.address;
		  	  			var eventName 						= _.capitalize(value.firstName) || _.capitalize(value.eventName);
		  	  			var eventDescriptio	n 		= value.description || homelessVolunteerMoveIn;
					    	var linkConfirm 					= 'http://' + host + '/confirm/volunteer/' + group._id + '/'+ value._id + '/' + value + '/yes';
					    	var linkReject 						= 'http://' + host + '/confirm/volunteer/' + group._id + '/'+ value._id + '/' + value + '/no';

						    var transporter = nodemailer.createTransport({
						      host: GodaddySMTP,
						      port: 25,
						      auth: {
						        user: 'hello@gobethe1.com',
						        pass: GodaddyPassword
						      }
						    });

						    var mailOptions = {
						      to:  email, //looping over the email list
						      from: 'hello@gobethe1.com',
						      subject: 'Are you available to volunteer?',
						      html:
						      	// gobe logo
						      	'<img style="display:block;margin:0 auto"src="https://s3-us-west-1.amazonaws.com/gobethe1-prod/confirm-email-logo.png"><br>' +

					          	// initial tag-line + details
					          	'<p> You have been invited by ' + groupLeader + ' to join the rest of ' + capOrgName + ' to help ' + eventName +
					          	' in your area on ' + finalDate + ' at ' + value.confirmTime + '. Can you make it?</p>' +

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


							    transporter.sendMail(mailOptions, function(err) {
							    	console.log("inside sendMail")
							    	console.log(err)
										console.log(mailOptions.to)
							      // return res.status(200).send('An e-mail has been sent to ' + user.email + ' with further instructions.');
							    });



						})
			});

		    done('done');


		  },
		], function(err) {
		  if (err) return (err);
		});

}


module.exports.matchZipCode = matchZipCode;
module.exports.updatedVolunteerMatch = updatedVolunteerMatch;
