'use strict';

var User = require('./user.model');
var Group = require('../group/group.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var stripeKey = process.env.STRIPE_API_KEY;
var plan = process.env.PLAN;
var stripe = require("stripe")(stripeKey);

var validationError = function(res, err) {
  return res.status(422).json(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.status(500).send(err);
    res.status(200).json(users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresIn: 60*45 });
    res.json({ token: token });
  });
};

/* Create new stripe customer subscription */
exports.createSubscription = function(req, res, next){
  stripe.customers.create({
    source: req.body.token,
    plan: plan,
    coupon: req.body.promo,
    email: req.body.email
  }, function(err, customer) {
      if(err){return res.status(200).json({status: 'error', error:err})}
      else{
        User.findById(req.body.user_id, function (err, user) {
            user.stripeCustomerId = customer.id;
            user.stripeData = customer.subscriptions.data;
            user.stripeDiscount = customer.discount;
            user.activeSubscription = true;
            
            user.save(function(err) {
              if (err){return validationError(res, err)}
              else{
              res.status(200).json({status:'success'});
              }
            });
        });
      }
  });
};

/* Retrieve Stripe Customer information */
exports.retrieveCustomer = function(req, res, next){
    stripe.customers.retrieve(
      req.params.id,
      function(err, customer) {
        if(err) return next(err)
        if(!customer) return res.status(401).send('Unauthorized');
        res.json(customer.subscriptions.data[0]);
      }
    );
}

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(422).send('Unauthorized');
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.status(500).send(err);
    return res.status(204).send('No Content');
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).send('OK');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
