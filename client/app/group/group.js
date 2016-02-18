'use strict';

angular.module('gobeApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('group', {
        url: '/group',
        templateUrl: 'app/group/group.html',
        controller: 'GroupCtrl'
        // resolve:{
        //  groupModel: function(group){
        //    return group.query().$promise;
        //  }
        // }
      })
      .state('group.list', {
        url: '/list',
        templateUrl: 'app/group/group-list.html',
        controller: 'GroupCtrl'
        // resolve:{
        //  groupModel: function(group){
        //    return group.query().$promise;
        //  }
        // }
      })
      .state('group.new', {
        url: '/new',
        templateUrl: 'app/group/group-new.html',
        controller: 'GroupCtrl'
        // resolve:{
        //  groupModel: function(group){
        //    return group.query().$promise;
        //  }
        // }
      });

      $urlRouterProvider.otherwise('/');
  });
