'use strict';

var express = require('express');
var controller = require('./test.controller');

var router = express.Router();

router.get('/events', controller.events);
router.get('/groups', controller.groups);
router.get('/sendgrid', controller.sendGrid);

module.exports = router;
