/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var q = require('q');

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Event = require('../api/event/event.model');
var Group = require('../api/group/group.model');

q.fcall(function() {
  return q.Promise(function(resolve,reject,notify) {
      Event.find({}).remove(function() {
        Event.create({
          firstName: 'bob',
          lastName: 'barker',
          address: '1000 hello way',
          zipCode: '90017',
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
          registryUrl: 'https://www.myregistry.com/public/gobe'
        },{
          firstName: 'ella',
          lastName: 'stella',
          address: '1000 hollyday ',
          zipCode: '90028',
          gender: 'female',
          host: "localhost:9000",
          availability: {
            moveInDate: new Date("2016-02-25T00:00:00-0800"),
            firstDate: new Date("2016-02-27T00:00:00-0800"),
            firstDateTime: [true, true, true],
            secondDate: new Date("2016-02-28T00:00:00-0800"),
            secondDateTime: [true, false, false],
            thirdDate: new Date("2016-02-29T00:00:00-0800"),
            thirdDateTime: [true, true, false]
          },
          registryUrl: 'https://www.myregistry.com/public/gobe'
        },{
          firstName: 'thomas',
          lastName: 'barners',
          address: '1000 yo yo yo',
          zipCode: '90012',
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
          },
          registryUrl: 'https://www.myregistry.com/public/gobe'
        }, function() {
            console.log('finished populating events');
            resolve();
        });
      });
      
  });

  }).then(function() {
    
    return q.Promise(function(resolve,reject,notify) {
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
            resolve();
        });
      });
    });

  }).then(function() {
    
    return q.Promise(function(resolve,reject,notify) {
        Group.find({}).remove(function() {
        Group.create({
          organizationName: 'Holly Rollers',
          firstName: 'Sally',
          lastName: 'Figueroa',
          email: 'sally@example.com', //'midgetllamas182@yahoo.com',
          phoneNumber: '313333333',
          zipCode: '90017'
        },{
          organizationName: 'Homes for vets',
          firstName: 'Casper',
          lastName: 'P',
          email: 'grock006@gmail.com', //'cassie.purtlebaugh@gmail.com',
          phoneNumber: '7467447474',
          zipCode: '90017'
        },{
          organizationName: 'Greg Rocks',
          firstName: 'Greg',
          lastName: 'Rock',
          email: 'gregorysaul7@example.com',
          phoneNumber: '7467447474',
          zipCode: '90012'
        },{
          organizationName: 'Feed The Homeless',
          firstName: 'Patty',
          lastName: 'Malone',
          email: 'pmalone@example.com',
          phoneNumber: '7467447474',
          zipCode: '90000'
        },
        function(error, doc) {
            console.log('finished populating groups');
        });
      });

    });

    
  });