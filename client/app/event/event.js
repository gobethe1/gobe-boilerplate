'use strict';

angular.module('gobeApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('event', {
        // abstract: true,
        url: '/event',
        templateUrl: 'app/event/event.html',
        controller: 'EventCtrl',
        resolve:{
         eventModel: function(Event){
           return Event.query().$promise;
         }
        }
      })
      .state('event.list', {
        url: '/list',
        templateUrl: 'app/event/event-list.html',
        controller: 'EventCtrl',
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
      });

      $urlRouterProvider.otherwise('/');
  });
