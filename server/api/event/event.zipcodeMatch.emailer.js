'use strict';

var mongoose = require('mongoose');
var async = require('async');
var Event = require('./event.model');
var Group = require('../group/group.model');

function matchZipCode(event){
	console.log("match zip code fires")
	console.log(event.zipCode);

	async.waterfall([
	  function(done) {
	    // crypto.randomBytes(20, function(err, buf) {
	    //   var token = 1;
	    //   done(err, token);
	    // });
	  },
	  function(done) {
	   	console.log("inside waterfall")
	    Group.find({ zipCode: this.zipCode }, function(err, group) {
	      if (!group) {
	      	console.log(err)
	        return res.status(404).send('There is no zipcode matches.');
	      }


	      // user.save(function(err) {
	      //   done(err, token, user);
	      // });
	    
	    });
	  },
	  function(group, done) {
	    // var transporter = nodemailer.createTransport({
	    //   service: 'Gmail',
	    //   auth: {
	    //     user: 'hello@castifi.com',
	    //     pass: gmailPassword
	    //   }
	    // });
	    // var mailOptions = {
	    //   to: user.email,
	    //   from: 'hello@castifi.com',
	    //   subject: 'Castifi Password Reset',
	    //   text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
	    //     'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
	    //     'http://' + req.headers.host + '/reset/' + token + '\n\n' +
	    //     'If you did not request this, please ignore this email and your password will remain unchanged.\n'
	    // };
	    // transporter.sendMail(mailOptions, function(err) {
	    //   return res.status(200).send('An e-mail has been sent to ' + user.email + ' with further instructions.');
	    //   done(err, 'done');
	    // });
	  }
	], function(err) {
	  if (err) return next(err);
	  // res.redirect('/forgot');
	});




}

exports.matchZipCode = matchZipCode;