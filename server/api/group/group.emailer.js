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
	     Event.find({zipCode: {$in: group.matchZipCodeArr}, confirmGroup:null, causeType: 'Homeless Move-in'},
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
						 '<p style="font-size:14px;font-family:sans-serif">Someone just moved off the streets and it\'s ' +
						 'time to party! This person now lives in your area and you have been invited to help welcome them home! Ready to make a difference?' +
						 ' Simply, accept the invite and start recruiting your friends.</p>' +
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

function updatedVolunteerMatch(group, host){
		console.log("hitting updatedVolunteerMatch")
		 
		 async.waterfall([
		 
		   function(done) {
		     Event.find({confirmGroup: group._id},
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
		  	  	var capOrgName = group.organizationName.capitalize();
	  		  	var number = group.phoneNumber.toString();
		  	  	var groupPhoneNumber  = '(' + number.substring(0,3) + ')' + number.substring(3,6) + '-' + number.substring(6,10);
	  	  	  	var gobeKitLink = 'https://s3-us-west-1.amazonaws.com/gobethe1-prod/welcome-kit.pdf';
	  	  		var gobeInstagram = 'https://www.instagram.com/gobethe1/';

	  	  		_.forEach(event, function(value){
				    console.log("forEach event", value)

				    	emailerListArr.map(function(email){
					    	console.log("hitting emailerListArr map")
					    	console.log("emailerListArr", email)

					    	var dateString 			= value.confirmDate.toString();
		  	  				var finalDate 			= dateString.slice(0, 10);
		  	  				var clientFirstName     = value.firstName.capitalize();
		  	  				var eventAddress 		= value.address;
					    	var linkConfirm 		= 'http://' + host + '/confirm/volunteer/' + group._id + '/'+ value._id + '/' + value + '/yes';
					    	var linkReject 			= 'http://' + host + '/confirm/volunteer/' + group._id + '/'+ value._id + '/' + value + '/no';

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
						      	'<p> Get ready to party! </p>' +
						      	'<p style="font-size:14px;font-family:sans-serif;font-weight:bold"> Details </p>' +
								    '<p> The ' + capOrgName + ' are confirmed for the ' +
								    'move-in party of ' + clientFirstName + ' on ' + finalDate + ' at ' + value.confirmTime + '.</p>' +

								    // event information
								    '<p style="font-size:14px;font-family:sans-serif;font-weight:bold"> Event Information </p>' +
								    '<p> Point person name: ' + capFirstName + ' ' + capLastName + '<br>' +
								    'Point person phone: ' + groupPhoneNumber + '</p>' +

								    // meetup address
								    '<p style="font-size:14px;font-family:sans-serif;font-weight:bold"> Meet up with your group at this address:</p>' +
								    '<p>' + value.meetupAddress + '<p>' +
								    '<p> From the meetup spot ' + capFirstName + ', your group leader, will direct you to the event</p>' +

								    // can you make it?
								    '<p style="font-size:14px;font-family:sans-serif;font-weight:bold">Can you make it? </p>' +
								   	'<a href=' + linkConfirm +  ' style="background-color:#4A90E2;border:1px solid #4A90E2;border-radius:5px;color:#ffffff ;display:inline-block;font-family:sans-serif;font-size:14px;line-height:44px;text-align:center;text-decoration:none;width:40%;-webkit-text-size-adjust:none;mso-hide:all;">Yes, I\'ll be there</a><br><br>' +
								    '<a href=' + linkReject +  '  style="text-decoration:underline;color:black;font-size:14px;">I can\'t make it</a><br><br>' +

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
								    '<p> Hope to see you there, <br><br>' +
								    'GOBE Team </p>'
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
