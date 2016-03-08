'use strict';

var _ = require('lodash');
var Group = require('./group.model');
var User = require('../user/user.model')

// Get list of groups
exports.index = function(req, res) {
  Group.find(function (err, groups) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(groups);
  });
};

// Get a single group
exports.show = function(req, res) {
  Group.findById(req.params.id, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.status(404).send('Not Found'); }
    return res.json(group);
  });
};

// Creates a new group in the DB.
exports.create = function(req, res) {
  Group.create(req.body, function(err, group) {
    console.log(err);
    if(err) { return handleError(res, err); }
    console.log("req body")
    console.log(req.body.ownedBy)
    console.log('group id')
    console.log(group._id)
    User.findById(req.body.ownedBy, function(err, user){
      if (err) { return handleError(res, err); }
        console.log('body id 2')
        console.log(req.body._id)
        var updated = _.merge(user, {groupId: group._id})
        console.log("user findById")
        console.log(user)
        updated.save(function (err) {
          if (err) { return handleError(res, err); }
        });
    })
    //group.ownedBy is the currentUser id
    // find currentUser id
    //find on the User model with the currentUser id
    // and update User.ownedBy with the group id
    return res.status(201).json(group);
  });
};

// Updates an existing group in the DB.
exports.update = function(req, res) {
  // console.log(req)
  if(req.body._id) { delete req.body._id; }
  Group.findById(req.params.id, function (err, group) {
    if (err) { return handleError(res, err); }
    if(!group) { return res.status(404).send('Not Found'); }
    var updated = _.merge(group, req.body);
    updated.emailList = req.body.emailList;
    console.log(updated)
    // updated.markModified('emailList');
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(group);
    });
  });
};

// Deletes a group from the DB.
exports.destroy = function(req, res) {
  Group.findById(req.params.id, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.status(404).send('Not Found'); }
    group.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
