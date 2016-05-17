'use strict';

var _ = require('lodash');
var Event = require('./event.model');
var eventEmailer = require('../event/event.emailer');

// Get list of events
exports.index = function(req, res) {
  Event.find(function (err, events) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(events);
  });
};

// Get a single event
exports.show = function(req, res) {
  Event.findById(req.params.id, function (err, event) {
    if(err) { return handleError(res, err); }
    if(!event) { return res.status(404).send('Not Found'); }
    return res.json(event);
  });
};

// Creates a new event in the DB.
exports.create = function(req, res) {
  req.body.host = req.headers.host
  Event.create(req.body, function(err, event) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(event);
  });
};

// Updates an existing event in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Event.findById(req.params.id, function (err, event) {
    if (err) { return handleError(res, err); }
    if(!event) { return res.status(404).send('Not Found'); }
    var updated = _.merge(event, req.body);
    updated.availability = req.body.availability;
    updated.confirmIndividuals = req.body.confirmIndividuals;
    event.markModified('confirmIndividuals');
    event.markModified('confirmedEmails');
    event.markModified('rejectedEmails');

    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      if((event.published) && ((event.confirmGroup !== null) && (event.confirmedEmails.length === 0))){
        eventEmailer.detailsToGroupLeader(event, req.headers.host);
      }
      return res.status(200).json(event);
    });
  });
};

// send out matching event to groups and save event
exports.send = function(req, res) {
  console.log(req.body)
  Event.create(req.body, function(err, event) {
    if(err) { return handleError(res, err); }
    // if no error and grouponly
    if(event.groupOnly === true) {
      console.log('firing false true');
      eventEmailer.matchZipCode(event, req.headers.host);
    }
    // if no error and !grouponly
    else{
      // console.log('event: ', event)
      console.log('firing false false');
      // console.log('event match individual: ', eventEmailer.matchZipCodeIndividual(event, req.headers.host));
      eventEmailer.matchZipCodeIndividual(event, req.headers.host);
    }
    return res.status(201).json(event);
  });
};

// send out matching event to groups when updating an event
exports.sendupdate = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Event.findById(req.params.id, function (err, event) {
    if (err) { return handleError(res, err); }
    if(!event) { return res.status(404).send('Not Found'); }
    var updated = _.merge(event, req.body);
    updated.availability = req.body.availability;
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      if(updated.groupOnly === true) {
        console.log('firing false true')
        eventEmailer.matchZipCode(event, req.headers.host);
      }
      else {
        console.log('firing false false');
        eventEmailer.matchZipCodeIndividual(event, req.headers.host);
      }
      // eventEmailer.matchZipCode(event, req.headers.host);
      return res.status(200).json(event);
    });
  });
};

// Deletes a event from the DB.
exports.destroy = function(req, res) {
  Event.findById(req.params.id, function (err, event) {
    if(err) { return handleError(res, err); }
    if(!event) { return res.status(404).send('Not Found'); }
    event.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
