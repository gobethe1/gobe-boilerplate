'use strict';

var mongoose = require('mongoose');
var async = require('async');
var _     = require('lodash');
var Event = require('./event.model');
var Group = require('../group/group.model');
var nodemailer = require('nodemailer');

function matchZipCode(event){
	var groupEmailArr = [];

	// console.log("match zip code fires")
	// console.log(event.zipCode);

	async.waterfall([
	  function(done) {
	   	// console.log("inside waterfall")
	    Group.find({ zipCode: event.zipCode }, function(err, group) {
	      if (!group) {
	      	console.log(err)
	        return res.status(404).send('There are no zipcode matches.');
	      }
	      else{
	      	console.log("matching groups")
	      	// console.log(group)
	      	group.map(function(value){
		      	console.log(value.email)
		      	groupEmailArr.push(value.email)
		      	console.log("inside groupEmailArr")
		      	console.log(groupEmailArr)
	     	})
	      }

	     

	      // user.save(function(err) {
	        done(err, group);
	      // });
	    
	    });
	  },
	  function(group, done) {

	  	console.log("outside groupEmailArr inside email yo")
	  	console.log(groupEmailArr)

	  	// "Godaddy": {
	  	//         "host": "smtpout.secureserver.net",
	  	//         "port": 25
	  	//     },
	    
	    var transporter = nodemailer.createTransport({
	      host: "localhost",
	      port: 25,
	      domain: "localhost",
	      auth: {
	        user: 'hello@gobethe1.com',
	        pass: 'getshitdone123!'
	      }
	    });
	    var mailOptions = {
	      to: 'cassie.purtlebaugh@gmail.com',
	      from: 'hello@gobethe1.com',
	      subject: 'Local Move In Opportunity',
	      text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
	        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
	        // 'http://' + req.headers.host + '/reset/' + token + '\n\n' +
	        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
	    };
	    transporter.sendMail(mailOptions, function(err) {
	      // return res.status(200).send('An e-mail has been sent to ' + user.email + ' with further instructions.');
	      done(err, 'done');
	    });
	  }
	], function(err) {
	  // if (err) return next(err);
	  console.log(err)
	  // res.redirect('/forgot');
	});




}

exports.matchZipCode = matchZipCode;