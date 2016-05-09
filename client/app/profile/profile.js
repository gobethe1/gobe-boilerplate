'use strict';

angular.module('gobeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('profile', {
        cache: false,
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
         customerInfo: function(User, currentUser){
          if(currentUser.stripeCustomerId){
           return User.retrieveCustomer({id: currentUser.stripeCustomerId}).$promise;
          }
          else{
            return null;
          }
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
      .state('profile.edit', {
        url: '/edit',
        templateUrl: 'app/profile/profile-edit.html',
        controller: 'VolunteerCtrl'
      })
      .state('profile.event', {
        url: '/event',
        abstract: true,
        template: "<div ui-view></div>",
        controller: 'ProfileCtrl'
      })
      .state('profile.event.list', {
        url: '/list',
        templateUrl: 'app/profile/profile-event-list.html',
        controller: 'ProfileEventCtrl',
      })
      .state('profile.event.show', {
        url: '/:id/show/:name',
        templateUrl: 'app/profile/profile-event-show.html',
        controller: 'ProfileEventShowCtrl',
        params: name,
        resolve:{
           eventShow: function(Event, $stateParams){
            return Event.get({id: $stateParams.id}).$promise;
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
      });
  });
