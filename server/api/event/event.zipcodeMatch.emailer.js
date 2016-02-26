'use strict';

var mongoose = require('mongoose');
var async = require('async');
var _     = require('lodash');
var Event = require('./event.model');
var Group = require('../group/group.model');
var nodemailer = require('nodemailer');
var GodaddyPassword = process.env.GODADDY_PASSWORD;
var GodaddySMTP = process.env.GODADDY_SMTP;

function matchZipCode(event){
	// console.log("==================================================")
	// console.log(event)
	// console.log("res")
	// console.log(res)
	// console.log("req")
	// console.log(req)

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
	    	console.log('http://' + event.host + '/event/' + event._id + '/confirm/' + value._id)
		    
		    // var transporter = nodemailer.createTransport({
		    //   host: GodaddySMTP,
		    //   port: 25,
		    //   auth: {
		    //     user: 'hello@gobethe1.com',
		    //     pass: GodaddyPassword
		    //   }
		    // });
		    
		    // var mailOptions = {
		    //   to: value.email,  //'cassie.purtlebaugh@gmail.com',
		    //   from: 'hello@gobethe1.com',
		    //   subject: 'Are You Available?',
		    //   text: 'Hello ' + value.firstName + ', we matched you with a move-in party of a homeless vet in your neighborhood!\n\n' +
		    //     'Check out the dates and times and let us know if you are available:\n\n' +
		    //     'http://' + event.host + '/event/' + event._id + '/confirm/' + value._id
		    // };
		
		    // transporter.sendMail(mailOptions, function(err) {
		    // 	console.log("inside sendMail err")
		    // 	console.log(err)
		    //   // return res.status(200).send('An e-mail has been sent to ' + user.email + ' with further instructions.');
		    // });
		
			//save the sentEmails to the array
			//would need to check group.emails against event sentEmails array before they are sent

		});

	    done('done');

	  
	  }
	], function(err) {
	  // if (err) return next(err);
	  console.log("last error")
	  console.log(err)
	  // res.redirect('/forgot');
	});




}

exports.matchZipCode = matchZipCode;