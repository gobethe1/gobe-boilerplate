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

// function seedEventUser(userEmail, firstName){
//   User.findOne({email: userEmail}), function(err, user){
//     Event.findOneAndUpdate({organizationName: eventName}, {$set: {userId: user._id}}, {new: true}),
//     function(err, event){
//       console.log(event)
//       console.log(err)
//     }
//   }
// }

q.fcall(function() {
  return q.Promise(function(resolve,reject,notify) {
      Event.find({}).remove(function() {
        Event.create({
          firstName: 'bob',
          lastName: 'barker',
          causeType: 'Homeless Move-in',
          address: '1000 hello way',
          zipCode: '90017',
          gender: 'male',
          phoneNumber: '1112223333',
          availability: {
            moveInDate: new Date("2016-02-25T00:00:00-0800"),
            firstDate: new Date("2016-02-26T00:00:00-0800"),
            firstDateTime: [true, true, false],
            secondDate: new Date("2016-02-27T00:00:00-0800"),
            secondDateTime: [true, true, true],
            thirdDate: new Date("2016-02-28T00:00:00-0800"),
            thirdDateTime: [true, false, false]
          },
          published: false,
          registryUrl: 'https://www.myregistry.com/public/gobe'
        },{
          firstName: 'ella',
          lastName: 'stella',
          causeType: 'Homeless Move-in',
          address: '1000 hollyday ',
          zipCode: '90017',
          gender: 'female',
          phoneNumber: '1112223333',
          availability: {
            moveInDate: new Date("2016-02-25T00:00:00-0800"),
            firstDate: new Date("2016-02-27T00:00:00-0800"),
            firstDateTime: [true, true, true],
            secondDate: new Date("2016-02-28T00:00:00-0800"),
            secondDateTime: [true, false, false],
            thirdDate: new Date("2016-02-29T00:00:00-0800"),
            thirdDateTime: [true, true, false]
          },
          published: false,
          registryUrl: 'https://www.myregistry.com/public/gobe'
        },{
          firstName: 'thomas',
          lastName: 'barners',
          causeType: 'Homeless Move-in',
          address: '1000 yo yo yo',
          zipCode: '90012',
          gender: 'male',
          phoneNumber: '1112223333',
          availability: {
            moveInDate: new Date("2016-02-27T00:00:00-0800"),
            firstDate: new Date("2016-02-27T00:00:00-0800"),
            firstDateTime: [true, false, false],
            secondDate: new Date("2016-02-27T00:00:00-0800"),
            secondDateTime: [true, true, false],
            thirdDate: new Date("2016-02-27T00:00:00-0800"),
            thirdDateTime: [true, true, true]
          },
          registryUrl: 'https://www.myregistry.com/public/gobe',
          published: true
        },{
          causeType: 'Other',
          address: '57 A St',
          eventName: 'Feed Da Poor',
          organizerFirstName: 'Cynthia',
          organizerLastName: 'Pickles',
          organizerEmail: 'cassie.purtlebaugh@gmail.com',
          zipCode: '90012',
          organizerPhoneNumber: '1112223333',
          notes: 'Let\'s help save the world and make a difference',
          availability: {
            moveInDate: new Date("2016-02-27T00:00:00-0800"),
            firstDate: new Date("2016-02-27T00:00:00-0800"),
            firstDateTime: [true, false, false],
            secondDate: new Date("2016-02-27T00:00:00-0800"),
            secondDateTime: [true, true, false],
            thirdDate: new Date("2016-02-27T00:00:00-0800"),
            thirdDateTime: [true, true, true]
          },
          published: true
        },{
          causeType: 'Other',
          address: '5000 freedom ave',
          eventName: 'Music for Kids',
          organizerFirstName: 'Sandra',
          organizerLastName: 'B',
          organizerEmail: 'cassie.purtlebaugh@gmail.com',
          organizerPhoneNumber: '1112223333',
          notes: 'Let\'s help save the world and make a difference',
          zipCode: '90017',
          availability: {
            moveInDate: new Date("2016-02-23T00:00:00-0800"),
            firstDate: new Date("2016-02-24T00:00:00-0800"),
            firstDateTime: [true, false, false],
            secondDate: new Date("2016-02-25T00:00:00-0800"),
            secondDateTime: [true, true, false],
            thirdDate: new Date("2016-02-26T00:00:00-0800"),
            thirdDateTime: [true, true, true]
          },
          published: true
        },
        function() {
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
          password: 'test',
          position: 'group'
        }, {
          provider: 'local',
          role: 'admin',
          name: 'Admin',
          email: 'gobethe1dev@gmail.com',
          password: 'admin',
          position: 'admin'
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
          address: '123 Example Street',
          zipCode: '90017',
          matchZipCodeArr: ['90071', '90017', '90012', '90050', '90020']
        },{
          organizationName: 'Homes for vets',
          firstName: 'Casper',
          lastName: 'P',
          email: 'cassie.purtlebaugh@example.com', //'gobethe1dev@gmail.com',
          phoneNumber: '7467447474',
          address: '456 Example Street',
          zipCode: '90000',
          matchZipCodeArr: ['90050', '90020']
        },{
          organizationName: 'Greg Rocks',
          firstName: 'Greg',
          lastName: 'Rock',
          email: 'gobethe1dev@gmail.com',
          phoneNumber: '7467447474',
          address: '789 Example Street',
          zipCode: '90017',
          matchZipCodeArr: ['90071', '90050', '90020'],
          emailList: ['gobethe1dev@gmail.com', 'grock006@example.com', 'cassie.purtlebaugh@example.com']
        },{
          organizationName: 'Feed The Homeless',
          firstName: 'Patty',
          lastName: 'Malone',
          email: 'pmalone@example.com',
          phoneNumber: '7467447474',
          address: '101 Example Street',
          zipCode: '90012',
          matchZipCodeArr: ['90071', '90050', '90020', '90028']
        },
        function(error, doc) {
            console.log('finished populating groups');
        });
      });

    });


  });
