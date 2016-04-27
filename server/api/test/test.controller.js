'use strict';

var _ = require('lodash');
var Event = require('../event/event.model');
var Group = require('../group/group.model');
var groupEmailer = require('../group/group.emailer');
var eventEmailer = require('../event/event.emailer');
var sendGridTest = require('../event/sendgrid.test');

// new group is created
//passing in all the groups
//still sending email to matching groups
exports.groups = function(req, res) {
	Group.find({}, function (err, groups) {
    	_.forEach(groups, function(group) {
    		groupEmailer.matchZipCode(group, "localhost:9000");
    	})
    });
	res.status(200).send('Groups Done');
};

exports.events = function(req, res) {
  Event.find({}, function (err, events) {
    _.forEach(events, function(event) {
      if(event.causeType === 'Homeless Move-in'){
        eventEmailer.matchZipCode(event, "localhost:9000");
      }
    })
  });
  res.status(200).send('bingo');
};

exports.sendGrid = function(req, res) {
  Event.find({}, function (err, events) {
    _.forEach(events, function(event) {
        sendGridTest.matchZipCodeSendgrid(event, "localhost:9000");
    })
  });
  // sendGridTest.sendEmail();
  res.status(200).send('bingo');
};

