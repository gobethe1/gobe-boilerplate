'use strict';

angular.module('gobeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        loginPrevent: true
      })
      .state('loaderio', {
        url: '/loaderio-886e0c4c50e8b89f36043c1799a6e789.txt',
        templateUrl: '../app/loaderio-886e0c4c50e8b89f36043c1799a6e789.txt'
      });
  });
