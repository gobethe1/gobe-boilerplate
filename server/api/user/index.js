'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
// var multer = require('multer');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.post('/subscription', controller.createSubscription);
router.post('/update', auth.isAuthenticated(), controller.update);
router.get('/:id/customer', controller.retrieveCustomer);
router.post('/forgot', controller.resetPassword);
router.post('/reset/:token', controller.acceptToken);
router.post('/uploads', auth.isAuthenticated(), controller.uploadPhoto);

module.exports = router;
