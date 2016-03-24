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
         },
         eventModel: function(Event){
           return Event.query().$promise;
         },
        userGroup: function(Group, currentUser){
            if(currentUser.groupId){
              return Group.get({id: currentUser.groupId}).$promise;
            }
            else{
              return null;
            }
          }
        }
      })
      .state('profile.details', {
        url: '/details',
        templateUrl: 'app/profile/profile-details.html',
        controller: 'ProfileCtrl'
      })
      .state('profile.event', {
        url: '/event',
        abstract: true,
        template: "<div ui-view></div>",
        // templateUrl: 'app/profile/profile-details.html',
        controller: 'ProfileCtrl'
      })
      .state('profile.event.list', {
        url: '/list',
        templateUrl: 'app/profile/profile-event-list.html',
        controller: 'ProfileEventCtrl',
      })
      .state('profile.event.show', {
        url: '/show',
        templateUrl: 'app/profile/profile-event-show.html',
        controller: 'ProfileEventCtrl',
      });
  });
