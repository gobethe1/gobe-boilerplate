/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Event = require('../api/event/event.model');

Event.find({}).remove(function() {
  Event.create({
    firstName: 'bob',
    lastName: 'barker',
    address: '1000 hello way',
    zipCode: '90020',
    gender: 'male',
    availability: {
      moveInDate: new Date("2016-02-27T00:00:00-0800"),
      firstDate: new Date("2016-02-27T00:00:00-0800"),
      firstDateTime: new Date("2016-02-27T00:00:00-0800"),
      secondDate: new Date("2016-02-27T00:00:00-0800"),
      secondDateTime: new Date("2016-02-27T00:00:00-0800"),
      thirdDate: new Date("2016-02-27T00:00:00-0800"),
      thirdDateTime: new Date("2016-02-27T00:00:00-0800")
    },
    registryUrl: 'asdfklj'
  },{
    firstName: 'ella',
    lastName: 'stella',
    address: '1000 hollyday ',
    zipCode: '90028',
    gender: 'female',
    availability: {
      moveInDate: new Date("2016-02-27T00:00:00-0800"),
      firstDate: new Date("2016-02-27T00:00:00-0800"),
      firstDateTime: new Date("2016-02-27T00:00:00-0800"),
      secondDate: new Date("2016-02-27T00:00:00-0800"),
      secondDateTime: new Date("2016-02-27T00:00:00-0800"),
      thirdDate: new Date("2016-02-27T00:00:00-0800"),
      thirdDateTime: new Date("2016-02-27T00:00:00-0800")
    }
  },{
    firstName: 'thomas',
    lastName: 'barners',
    address: '1000 yo yo yo',
    zipCode: '90020',
    gender: 'male',
    availability: {
      moveInDate: new Date("2016-02-27T00:00:00-0800"),
      firstDate: new Date("2016-02-27T00:00:00-0800"),
      firstDateTime: new Date("2016-02-27T00:00:00-0800"),
      secondDate: new Date("2016-02-27T00:00:00-0800"),
      secondDateTime: new Date("2016-02-27T00:00:00-0800"),
      thirdDate: new Date("2016-02-27T00:00:00-0800"),
      thirdDateTime: new Date("2016-02-27T00:00:00-0800")
    }
  }, function() {
      console.log('finished populating events');
    });
});


// Thing.find({}).remove(function() {
//   Thing.create({
//     name : 'Development Tools',
//     info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
//   }, {
//     name : 'Server and Client integration',
//     info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
//   }, {
//     name : 'Smart Build System',
//     info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
//   },  {
//     name : 'Modular Structure',
//     info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
//   },  {
//     name : 'Optimized Build',
//     info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
//   },{
//     name : 'Deployment Ready',
//     info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
//   }, function() {
//       console.log('finished populating things');
//     });
// });

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
