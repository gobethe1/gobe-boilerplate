'use strict';

angular.module('gobeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '/profile',
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
       	 currentUser: function(Auth){
            return Auth.getCurrentUser().$promise;
         }
        }
      })
      .state('profile.details', {
        url: '/details',
        templateUrl: 'app/profile/profile-details.html',
        controller: 'ProfileCtrl'
      });
  });