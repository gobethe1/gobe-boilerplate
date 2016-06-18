'use strict';

angular.module('gobeApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('volunteer', {
        url: '/volunteer',
        templateUrl: 'app/volunteer/volunteer.html',
        controller: 'VolunteerCtrl',
        resolve: {
        	currentUser: function(Auth){
        	   return Auth.getCurrentUser().$promise;
        	}
        }
      })
      .state('volunteer.signup', {
        url: '/signup',
        templateUrl: 'app/volunteer/volunteer-signup.html',
        controller: 'VolunteerCtrl',
      })
      .state('volunteer.photo', {
        url: '/photo',
        templateUrl: 'app/volunteer/volunteer-photo.html',
        controller: 'VolunteerCtrl',
      })
      .state('volunteer.profile', {
        url: '/profile',
        templateUrl: 'app/volunteer/volunteer-profile.html',
        controller: 'VolunteerCtrl',

      });

      $urlRouterProvider.otherwise('/');

  });
