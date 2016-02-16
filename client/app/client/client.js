'use strict';

angular.module('gobeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('client', {
        abstract: true,
        url: '/client',
        template: '<ui-view></>',
        controller: 'ClientCtrl'
      })
      .state('client.list' {
        url: '/client/list',
        templateUrl: 'app/client/client-list.html',
        controller: 'ClientCtrl'
      })
      .state('client.new', {
        url: '/client/new',
        templateUrl: 'app/client/client-new.html',
        controller: 'ClientCtrl'
      });

      $urlRouterProvider.otherwise('/');
  });
