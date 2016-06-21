'use strict';
var async             = require('async');
var User              = require('./user.model');
var Group             = require('../group/group.model');
var passport          = require('passport');
var config            = require('../../config/environment');
var jwt               = require('jsonwebtoken');
var crypto            = require('crypto');
var _                 = require('lodash');
var path              = require('path');
var fs                = require('fs');
var stripeKey         = process.env.STRIPE_API_KEY;
var plan              = process.env.PLAN;
var urlLink           = process.env.RESET_PW_LINK;
var stripe            = require("stripe")(stripeKey);
var SENDGRID_API_KEY  = process.env.SENDGRID_API_KEY;
var sendgrid          = require('sendgrid')(SENDGRID_API_KEY);
var gobeEmailAddress  = 'hello@getgobe.com';
var AWS               = require('aws-sdk');
var AWS_ACCESS_KEY_ID        = process.env.AMZ_ACCESS_KEY_ID;
var AWS_SECRET_ACCESS_KEY    = process.env. AMZ_ACCESS_SECRET_KEY;
var AWS_S3_BUCKET            = process.env.AMZ_S3_BUCKET;
var s3Link                   = process.env.s3Link;

exports.uploadPhoto = function(req, res){
  console.log('file: ', req.body)
  console.log('firing')
  var file = req.file
  var id = file.originalname.split('.');
  console.log('id: ', id)
  var userId = id[0];
  console.log('userid: ', userId)

    fs.readFile(file.path, function (err, data) {
      console.log('file: ', file)
      console.log('mimetype: ', file.mimetype)
      console.log('file type:', file.type)

      if (err) throw err;
         AWS.config.update({accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY });
         AWS.config.region = 'us-west-1';
        console.log(AWS.config)

         var s3 = new AWS.S3({
            sslEnabled: true,
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY
          });

         var params = {
             Key: file.originalname,
             Bucket: AWS_S3_BUCKET,
             Body: data, //buffer
             ContentType: file.mimetype
         };

         s3.putObject(params, function(err, data) {
           if(err) {
             console.log(err.message,err.code);
             return false;
           }
           else {
             console.log('File Uploaded Successfully', 'Done');
           }
         })
    })

    User.findById(userId, function (err, user) {
      console.log('user in user save: ', user)
      console.log('req body?: ', req.body)
      console.log('err: ', err)
      if (err) { return handleError(res, err); }

      user.photo = s3Link + file.originalname

      user.save(function (err) {
        if (err) { return handleError(res, err); }
        console.log("user photo saved / updated successfully");
      });

  });


}


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

// Updates an existing user in the DB.
exports.update = function(req, res) {
  var userId = req.user._id;

  User.findById(userId, function (err, user) {
    console.log('err: ', err)
    if (err) { return handleError(res, err); }
    if(!user) { return res.status(404).send('Not Found'); }
    var updated = _.merge(user, req.body);
    updated.matchZipCodeArr = req.body.matchZipCodeArr;
    user.markModified('matchZipCodeArr');

    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      console.log("htting inside update user save")
      return res.status(200).json(user);
    });

  });
};

exports.changePassword = function(req, res, next) {
  var userId = req.user._id;

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
* Reset Password
*/

exports.resetPassword = function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          return res.status(404).send('This email is not registered.');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour


        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
        var email = new sendgrid.Email({
                to: user.email,
                from: gobeEmailAddress,
                subject: 'Reset Password',
                html: '<h1></h1>',
            });

            var resetlink = urlLink + token;
            console.log('user: ', user.email)
            console.log('token: ', token)
            console.log("resetlink: ", resetlink)
            console.log('request header host: ', req.headers.host)


            email.addFilter('templates', 'template_id', '05d029a6-21df-4373-a8fb-00280cdf85f1');
            email.setSubstitutions({"%resetlink%": [resetlink]})

            sendgrid.send(email, function(err, json) {
             if (err) { return console.error(err); }
             console.log(json);
             done('done');
            });


      },

  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
};

exports.acceptToken = function(req, res, next){
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          return res.status(404).send('Password reset token is invalid or has expired.');
        }
        else{
          user.password = req.body.password;
          user.passwordConfirm = req.body.passwordConfirm;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

            user.save(function(err) {
              if(user.authenticate(req.body.password)){
                   if (err) return validationError(res, err);
                   done(err, user)
                }
            });
          }
      });
    },
    function(user, done) {
            var email = new sendgrid.Email({
                to: user.email,
                from: gobeEmailAddress,
                subject: 'Your password has been reset',
                html: '<h1></h1>',
            });

            email.addFilter('templates', 'template_id', 'df24931d-0b49-434b-bd9e-e7179134e928');

            sendgrid.send(email, function(err, json) {
              if (err) { return console.error(err); }
              else {res.status(200).send('Your password has been successfully changed!')}      ;
            });

    }
  ], function(err) {
    res.redirect('/');
  });
};


/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
