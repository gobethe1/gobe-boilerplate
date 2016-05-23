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
var SENDGRID_API_KEY 	= process.env.SENDGRID_API_KEY;
var sendgrid  				= require('sendgrid')(SENDGRID_API_KEY);
var gobeEmailAddress  = 'hello@getgobe.com';
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



// replaces matchZipCode
function matchZipCode(event, host){
  console.log('event in matchzip async: ', event);
  async.waterfall([
      function(done) {
        Group.find({ matchZipCodeArr: {$elemMatch: {$eq: event.zipCode} }},
          function(err, group) {
          if (!group) {
            // console.log(err)
            // return res.status(404).send('There are no zipcode matches.');
          }
          console.log('group: ', group)
           done(err, group);
        });
      },
      function(group, done) {

        group.map(function(value){

            var link = 'http://' + host + '/confirm/' + event._id + '/' + value._id;
            var capFirstName = _.capitalize(value.firstName);
            var eventName = _.capitalize(event.firstName) || _.capitalize(event.eventName);
            var eventDescription = event.description  || homelessMoveinDescription;
            var mapLink = 'http://maps.googleapis.com/maps/api/staticmap?center=' + event.zipCode + '&zoom=14&size=800x300&markers=' + event.zipCode + '&key=' + GoogleAPIKey
            console.log("email", value.email)

            var email = new sendgrid.Email({
                to: value.email,
                from: gobeEmailAddress,
                subject: 'Are You Available?',
                html: '<h1></h1>',
            });

            console.log("capFirstName")
            console.log(capFirstName)

            email.addFilter('templates', 'template_id', 'bc764a16-9e00-4cae-b42e-5e6fb11d282f');
            email.setSubstitutions({"%capFirstName%": [capFirstName], "%eventName%": [eventName], "%link%":[link], "%eventDescription%": [eventDescription] })

            sendgrid.send(email, function(err, json) {
             if (err) { return console.error(err); }
             console.log(json);
            });


        });

        done('done');


      },
    ], function(err) {
      if (err) return (err);
    });
}

// replaces matchZipCode
function matchZipCodeIndividual(event, host){

  async.waterfall([
      function(done) {
        User.find({ matchZipCodeArr: {$elemMatch: {$eq: event.zipCode} }},
          function(err, user) {
          if (!user) {
            // console.log(err)
            // return res.status(404).send('There are no zipcode matches.');
          }
           console.log('user inside find: ', user.length)
           done(err, user);
        });
      },

      function(user, done) {

        user.map(function(value){
            console.log('value in user map: ', value)
            // var link = 'http://' + host + '/confirm/individual/' + event._id + '/' + value._id;
            var link             = 'http://' + host + '/login';
            var capFirstName     = _.capitalize(value.firstName);
            var eventName        = _.capitalize(event.firstName) || _.capitalize(event.eventName);
            var eventDescription = event.description  || homelessMoveinDescription;
            var mapLink = 'http://maps.googleapis.com/maps/api/staticmap?center=' + event.zipCode + '&zoom=14&size=800x300&markers=' + event.zipCode + '&key=' + GoogleAPIKey;

            var email = new sendgrid.Email({
                to: value.email,
                from: gobeEmailAddress,
                subject: 'Are You Available?',
                html: '<h1></h1>',
            });

            email.addFilter('templates', 'template_id', 'd9eae8d0-0318-41af-ad2c-0158e1cad6bf');
            email.setSubstitutions({"%capFirstName%": [capFirstName], "%eventName%": [eventName], "%link%":[link], "%eventDescription%": [eventDescription] })

            sendgrid.send(email, function(err, json) {
             if (err) { return console.error(err); }
             console.log(json);
             console.log('firing email off')
            });


        });

        done('done');


      },
    ], function(err) {
      if (err) return (err);
    });
}

// replaces volunteer match
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
	  	  var confirmTime 			= event.confirmTime


		    group.emailList.map(function(value){

		    	var linkConfirm = 'http://' + host + '/confirm/volunteer/' + group._id + '/'+ event._id + '/' + value + '/yes';
		    	var linkReject =  'http://' + host + '/confirm/volunteer/' + group._id + '/'+ event._id + '/' + value + '/no';

 					var email = new sendgrid.Email({
                to: value,
                from: gobeEmailAddress,
                subject: 'Are You Available to volunteer?',
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

			});

		    done('done');


		  },
		], function(err) {
		  if (err) return (err);
		});
}


// replaces detailsToEventCreator
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
			  	      var dateString = event.confirmDate.toString();
			  	      var finalDate = dateString.slice(0, 10);
			  	      var capOrgName = group.organizationName.capitalize();
			  	      var eventName = event.eventName || event.firstName;
			  	      var confirmTime = event.confirmTime;

			 					var email = new sendgrid.Email({
			                to: eventContact,
			                from: gobeEmailAddress,
			                subject: eventName + ' has been matched!',
			                html: '<h1></h1>',
			          });

			            email.addFilter('templates', 'template_id', '65e51e9a-5ae9-4921-b4c5-855493c08d41');
			            email.setSubstitutions({"%capOrgName%": [capOrgName], "%eventName%": [eventName],
			            												"%finalDate%": [finalDate], "%confirmTime%": [confirmTime]
			            											})

			          sendgrid.send(email, function(err, json) {
			           if (err) { return console.error(err); }
			           console.log(json);
			          });

			    done('done');


			  },
			], function(err) {
			  if (err) return (err);
			});
}


// replaces detailsToGroupLeader
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

					  		var groupContact 					= group.email;
			  	      var dateString 						= event.confirmDate.toString();
			  	      var finalDate 						= dateString.slice(0,10);
			  	      var capOrgName 						= group.organizationName.capitalize();
			  	      var number 								= event.organizerPhoneNumber.toString() || event.phoneNumber.toString();
	  	  			  var clientPhoneNumber 		= '(' + number.substring(0,3) + ') ' + number.substring(3,6) + '-' + number.substring(6,10);
	  	  			  var phoneNumber 					= clientPhoneNumber || organizerPhoneNumber;
			  	      var eventAddress 					= event.address;
			  	      var eventName 						= event.eventName || event.firstName;
			  	      var confirmTime 					= event.confirmTime;
			  	      var eventMeetup 					= event.meetupAddress;
			  	      var eventDescription 			= event.description  || homelessMoveinDescription;
			  	      var eventRegistryUrl 			= event.registryUrl
			  	      var eventNotes  					= event.notes || "";
			  	      var organizerFirstName 		= event.organizerFirstName;
			  	      var organizerLastName 		= event.organizerLastName;
			  	      var organizerPhoneNumber 	= event.organizerPhoneNumber;
			  	      var organizerEmail 				= event.organizerEmail

								var email = new sendgrid.Email({
			                to: groupContact,
			                from: gobeEmailAddress,
			                subject: eventName + ' Details',
			                html: '<h1></h1>',
			          });

			            email.addFilter('templates', 'template_id', '39c399f3-4685-488c-aea6-8ef6e267ed50');
			            email.setSubstitutions({"%capOrgName%": [capOrgName], "%eventName%": [eventName], "%finalDate%": [finalDate],
			            												"%confirmTime%": [confirmTime], "%phoneNumber%": [phoneNumber], "%eventAddress%": [eventAddress],
			            												"%eventMeetup%": [eventMeetup], "%eventDescription%": [eventDescription],
			            												"%eventRegistryUrl%": [eventRegistryUrl], "%eventNotes%": [eventNotes],
			            												"%organizerFirstName%": [organizerFirstName], "%organizerLastName%": [organizerLastName],
			            												"%organizerEmail%": [organizerEmail], "%organizerPhoneNumber%": [organizerPhoneNumber]
			            											})

			          sendgrid.send(email, function(err, json) {
			           if (err) { return console.error(err); }
			           console.log(json);
			          });

			  	detailsToEventCreator(event, host);
			  	volunteerMatch(event, host);
	    		done('done');

	  },
	], function(err) {
	  if (err) return (err);
	});
}

module.exports.detailsToGroupLeader   = detailsToGroupLeader;
module.exports.volunteerMatch         = volunteerMatch;
module.exports.detailsToEventCreator  = detailsToEventCreator;
module.exports.matchZipCode           = matchZipCode;
module.exports.matchZipCodeIndividual = matchZipCodeIndividual;
