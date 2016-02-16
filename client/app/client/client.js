'use strict';

angular.module('gobeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('client', {
        url: '/client',
        templateUrl: 'app/client/client.html',
        controller: 'ClientCtrl'
      });
  });