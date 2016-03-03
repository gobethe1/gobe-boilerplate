'use strict';

var _ = require('lodash');
var Event = require('../event/event.model');
var Group = require('../group/group.model');
var groupEmailer = require('../group/group.emailer');
var eventEmailer = require('../event/event.emailer');

// Get list of things
exports.groups = function(req, res) {
	Group.find({}, function (err, groups) {
    	_.forEach(groups, function(group) {
    		groupEmailer.matchZipCode(group);
    	})
    });
	res.status(200).send('Groups Done');
};

exports.events = function(req, res) {
  Event.find({}, function (err, events) {
    _.forEach(events, function(event) {
      eventEmailer.matchZipCode(event);
    })
  });
  res.status(200).send('bingo');
};
