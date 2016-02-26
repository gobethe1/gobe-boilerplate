/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Event = require('../api/event/event.model');
var Group = require('../api/group/group.model');

Event.find({}).remove(function() {
  Event.create({
    firstName: 'bob',
    lastName: 'barker',
    address: '1000 hello way',
    zipCode: '90020',
    gender: 'male',
    host: "localhost:9000",
    availability: {
      moveInDate: new Date("2016-02-27T00:00:00-0800"),
      firstDate: new Date("2016-02-27T00:00:00-0800"),
      firstDateTime: [true, true, false],
      secondDate: new Date("2016-02-27T00:00:00-0800"),
      secondDateTime: [true, true, true],
      thirdDate: new Date("2016-02-27T00:00:00-0800"),
      thirdDateTime: [true, false, false]
    },
    registryUrl: 'test string'
  },{
    firstName: 'ella',
    lastName: 'stella',
    address: '1000 hollyday ',
    zipCode: '90028',
    gender: 'female',
    host: "localhost:9000",
    availability: {
      moveInDate: new Date("2016-02-27T00:00:00-0800"),
      firstDate: new Date("2016-02-27T00:00:00-0800"),
      firstDateTime: [true, true, true],
      secondDate: new Date("2016-02-27T00:00:00-0800"),
      secondDateTime: [true, false, false],
      thirdDate: new Date("2016-02-27T00:00:00-0800"),
      thirdDateTime: [true, true, false]
    }
  },{
    firstName: 'thomas',
    lastName: 'barners',
    address: '1000 yo yo yo',
    zipCode: '90020',
    gender: 'male',
    host: "localhost:9000",
    availability: {
      moveInDate: new Date("2016-02-27T00:00:00-0800"),
      firstDate: new Date("2016-02-27T00:00:00-0800"),
      firstDateTime: [true, false, false],
      secondDate: new Date("2016-02-27T00:00:00-0800"),
      secondDateTime: [true, true, false],
      thirdDate: new Date("2016-02-27T00:00:00-0800"),
      thirdDateTime: [true, true, true]
    }
  }, function() {
      console.log('finished populating events');
  });
});

Group.find({}).remove(function() {
  Group.create({
    organizationName: 'Holly Rollers',
    firstName: 'Sally',
    lastName: 'Figueroa',
    email: 'sally@example.com', //'midgetllamas182@yahoo.com',
    phoneNumber: '313333333',
    zipCode: '90028'
  },{
    organizationName: 'Homes for vets',
    firstName: 'Casper',
    lastName: 'P',
    email: 'cassie@example.com', //'cassie.purtlebaugh@gmail.com',
    phoneNumber: '7467447474',
    zipCode: '90028'
  },{
    organizationName: 'Greg Rocks',
    firstName: 'Greg',
    lastName: 'Rock',
    email: 'greg@example.com', //'grock006@gmail.com',
    phoneNumber: '7467447474',
    zipCode: '90017'
  },{
    organizationName: 'Feed The Homeless',
    firstName: 'Patty',
    lastName: 'Malone',
    email: 'pmalone@example.com',
    phoneNumber: '7467447474',
    zipCode: '90015'
  },
  function() {
      console.log('finished populating groups');
  });
});


User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});
