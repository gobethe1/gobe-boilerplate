'use strict';

angular.module('gobeApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('event', {
        url: '/event',
        templateUrl: 'app/event/event.html',
        controller: 'EventCtrl',
        adminProtected: true,
        resolve:{
         eventModel: function(Event){
           return Event.query().$promise;
         },
         currentUser: function(Auth){
            return Auth.getCurrentUser().$promise;
         },
        }
      })
      .state('event.list', {
        url: '/list',
        templateUrl: 'app/event/event-list.html',
        controller: 'EventCtrl',
        adminProtected: true,
        resolve:{
         eventModel: function(Event){
           return Event.query().$promise;
         }
        }
      })
      .state('event.new', {
        url: '/new',
        templateUrl: 'app/event/event-new.html',
        controller: 'EventCtrl',
        resolve:{
         eventModel: function(Event){
           return Event.query().$promise;
         }
        }
      })

       .state('event.show', {
        url: '/:id/show',
        templateUrl: 'app/event/event-show.html',
        controller: 'EventShowCtrl',
        resolve:{
          eventShow: function(Event, $stateParams){
            return Event.get({id: $stateParams.id}).$promise;
          },
          eventGroup: function(Group, eventShow){
            if(eventShow.confirmGroup){
              return Group.get({id: eventShow.confirmGroup }).$promise;
            }
            else{
              return null;
            }
          }
        }
      })

       .state('event.edit', {
        url: '/:id/edit',
        templateUrl: 'app/event/event-edit.html',
        controller: 'EventEditCtrl',
        resolve:{
         eventEdit: function(Event, $stateParams){
           return Event.get({id: $stateParams.id}).$promise;
         }
        }
      });


      $urlRouterProvider.otherwise('/');
  });
