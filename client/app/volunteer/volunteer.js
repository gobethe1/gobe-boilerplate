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

      .state('volunteer.profile', {
        url: '/profile',
        templateUrl: 'app/volunteer/volunteer-profile.html',
        controller: 'VolunteerCtrl',
       
      });

      $urlRouterProvider.otherwise('/');

  });