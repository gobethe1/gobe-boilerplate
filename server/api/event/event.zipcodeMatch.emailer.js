'use strict';

var mongoose = require('mongoose');
var async = require('async');
var _     = require('lodash');
var Event = require('./event.model');
var Group = require('../group/group.model');
var nodemailer = require('nodemailer');
var GodaddyPassword = process.env.GODADDY_PASSWORD;
var GodaddySMTP = process.env.GODADDY_SMTP;



function testZip(event){
	Group.find({ zipCode: event.zipCode }, function(err, group) {
	  if (!group) {
	  	// console.log(err)
	    // return res.status(404).send('There are no zipcode matches.');
	  }
	  return group;
	});
	return "hello"
}

function findZip(event){
	var test = Group.find({ zipCode: event.zipCode }).exec()
	return test;
};

function checkZip(event){
	var sentEmails = [];
	// console.log("checkZip")
	// console.log(event)

	var promise = findZip(event);
	
	promise.then(function(jedis){
	   jedis.forEach(function(jedi){
	   	  // console.log("jedi email")
	      // console.log(jedi.email);
	      sentEmails.push(jedi.email)


	   });
	 // console.log("sentEmails")
	 // console.log(sentEmails)
	 // console.log(event._id)  
	 // Event.update({id: event._id}, {sentEmails:[1,2,3]}, function(error){
	 // 	if(error){console.log(error)}
	 // 	else console.log("success")
	 // })
	 // var updated = _.merge(event, {sentEmails: sentEmails})
	
	 // updated.save().exec()

	})

	// return sentEmails; 
}

function matchZipCode(event){

	// console.log("testZip")
	// console.log(findZip(event))

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
	  	//if value.email !==
	  // 	console.log("sentEmails")
	 	// console.log(event.sentEmails)//array
	 	// var bazinga = _.filter(group, { 'email': 'sally@example.com' });
	 	// console.log('bazinga')
	 	// console.log(bazinga)
	 	//

	 	// _.forEach(group, function(value){
	 	// 	console.log("inner each")
	 	// 	console.log(value)
	 	// })

	    group.map(function(value){

	    	var index = _.indexOf(event.sentEmails, value.email)
	    	console.log("index")
	    	console.log(event.sentEmails)
	    	console.log(value.email)
	    	console.log(index)
	    	
	    	// console.log('http://' + event.host + '/event/' + event._id + '/confirm/' + value._id)
		    
		    var transporter = nodemailer.createTransport({
		      host: GodaddySMTP,
		      port: 25,
		      auth: {
		        user: 'hello@gobethe1.com',
		        pass: GodaddyPassword
		      }
		    });

		    //need to check value.email against event.sentEmails array and only allow items not in the sentEmails array
		    
		    var mailOptions = {
		      to: value.email,  //'cassie.purtlebaugh@gmail.com',
		      from: 'hello@gobethe1.com',
		      subject: 'Are You Available?',
		      text: 'Hello ' + value.firstName + ', we matched you with a move-in party of a homeless vet in your neighborhood!\n\n' +
		        'Check out the dates and times and let us know if you are available:\n\n' +
		        'http://' + event.host + '/event/' + event._id + '/confirm/' + value._id
		    };
		
			if(index === -1){
		    transporter.sendMail(mailOptions, function(err) {
		    	// console.log(mailOptions)
		    	console.log("inside sendMail error")
		    	console.log(err)
		      // return res.status(200).send('An e-mail has been sent to ' + user.email + ' with further instructions.');
		    });
			}

		    // console.log("value email")
		    // console.log(value.email)
		    // var emailArr = []
		    // sentEmails.push(value.email);
		    // event.sentEmails = emailArr;
		 
		    // event.save(function (err) {
		    //   if (err) { return err; }
		    // });
		
		
			//save the sentEmails to the array
			//would need to check group.emails against event sentEmails array before they are sent

		});

		// event.sentEmails = sentEmails;
		
		// event.save(function (err) {
		//   if (err) { return err; }
		//   done();
		// });

	    done('done');

	  
	  },
	], function(err) {
	  // if (err) return next(err);
	  // console.log("last error")
	  // console.log(err)
	  // res.redirect('/forgot');
	});




}

exports.checkZip = checkZip;
exports.findZip = findZip;
exports.matchZipCode = matchZipCode;