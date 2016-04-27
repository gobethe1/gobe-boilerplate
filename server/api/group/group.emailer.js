'use strict';

var mongoose 					= require('mongoose');
var async 						= require('async');
var _     						= require('lodash');
var Event 						= require('../event/event.model');
var nodemailer 				= require('nodemailer');
var GodaddyPassword 	= process.env.GODADDY_PASSWORD;
var GodaddySMTP 			= process.env.GODADDY_SMTP;
var GoogleAPIKey 			= process.env.GOOGLE_API_KEY;
var SENDGRID_API_KEY 	= process.env.SENDGRID_API_KEY;
var sendgrid  				= require('sendgrid')(SENDGRID_API_KEY);
var gobeEmailAddress  = 'hello@getgobe.com';

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

			     	var link = 'http://' + host + '/confirm/' + event._id + '/' + group._id;
			     	var capFirstName = _.capitalize(group.firstName);
			     	var mapLink = 'http://maps.googleapis.com/maps/api/staticmap?center=' + event.zipCode + '&zoom=14&size=800x300&markers=' + event.zipCode + '&key=' + GoogleAPIKey
			     	var eventDescription = event.description ||  homelessMoveinDescription;
			     	var eventName = _.capitalize(event.firstName) || _.capitalize(event.eventName);

		            var email = new sendgrid.Email({
		                to: group.email,
		                from: gobeEmailAddress,
		                subject: 'Are You Available? Group TEST',
		                html: '<h1></h1>',
		            });

		            email.addFilter('templates', 'template_id', 'bc764a16-9e00-4cae-b42e-5e6fb11d282f');
		            email.setSubstitutions({"%capFirstName%": [capFirstName], "%eventName%": [eventName], "%link%":[link], "%eventDescription%": [eventDescription] })

		            sendgrid.send(email, function(err, json) {
		             if (err) { return console.error(err); }
		             console.log(json);
		            });

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

	  	  		_.forEach(event, function(value){
				    console.log("forEach event", value)

				    	emailerListArr.map(function(value){
					    	console.log("hitting emailerListArr map")
					    	console.log("emailerListArr", value)

					    	var dateString 						= value.confirmDate.toString();
		  	  			var finalDate 						= dateString.slice(0, 10);
		  	  			var clientFirstName	     	= value.firstName.capitalize();
		  	  			var eventAddress 					= value.address;
		  	  			var eventName 						= _.capitalize(value.firstName) || _.capitalize(value.eventName);
		  	  			var eventDescription		 	= value.description || homelessVolunteerMoveIn;
					    	var linkConfirm 					= 'http://' + host + '/confirm/volunteer/' + group._id + '/'+ value._id + '/' + value + '/yes';
					    	var linkReject 						= 'http://' + host + '/confirm/volunteer/' + group._id + '/'+ value._id + '/' + value + '/no';
					    	var confirmTime						= value.confirmTime;

			 					var email = new sendgrid.Email({
			                to: value,
			                from: gobeEmailAddress,
			                subject: 'Are You Available to volunteer? TEST',
			                html: '<h1></h1>',
			          });

			            email.addFilter('templates', 'template_id', '944afe10-58ba-49eb-a60c-2c36446d42c0');
			            email.setSubstitutions({"%groupLeader%": [groupLeader], "%capOrgName%": [capOrgName], "%eventName%": [eventName],
			            												"%finalDate%": [finalDate], "%confirmTime%": [confirmTime], "%linkConfirm%": [linkConfirm],
			            												"%linkReject%": [linkReject], "%eventDescription%": [eventDescription] })

			          sendgrid.send(email, function(err, json) {
			           if (err) { return console.error(err); }
			           console.log(json);
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
