'use strict';

var _ = require('lodash');
var Event = require('../event/event.model');
var Group = require('../group/group.model');
var groupEmailer = require('../group/groupemailer');
//var eventEmailer = require('../event/event.zipcodeMatch.emailer');

//console.log(Group);

// Get list of things
exports.groups = function(req, res) {
	Group.find({}, function (err, groups) {
    	_.forEach(groups, function(group) {
    		console.log(group);
    		groupEmailer.matchZipCode(group,Event);
    		
    	})
    //return res.status(200).json(things);
  	});
	res.status(200).send('Groups Done');
};

exports.events = function(req, res) {
	res.status(200).send('bingo');
};
