'use strict';

angular.module('gobeApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('event', {
        // abstract: true,
        url: '/event',
        templateUrl: 'app/event/event.html',
        controller: 'EventCtrl'
      })
      .state('event.list', {
        url: '/list',
        templateUrl: 'app/event/event-list.html',
        controller: 'EventCtrl'
      })
      .state('event.new', {
        url: '/new',
        templateUrl: 'app/event/event-new.html',
        controller: 'EventCtrl'
      });

      $urlRouterProvider.otherwise('/');
  });
