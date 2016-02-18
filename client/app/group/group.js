'use strict';

angular.module('gobeApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('group', {
        url: '/group',
        templateUrl: 'app/group/group.html',
        controller: 'GroupCtrl',
        resolve:{
         groupModel: function(Group){
           return Group.query().$promise;
         },
          Confirmation: function($stateParams){
          console.log($stateParams)
          return $stateParams;
         }
        }
      })
      .state('group.list', {
        url: '/list',
        templateUrl: 'app/group/group-list.html',
        controller: 'GroupCtrl',
        resolve:{
         groupModel: function(Group){
           return Group.query().$promise;
         }
        }
      })
      .state('group.new', {
        url: '/new',
        templateUrl: 'app/group/group-new.html',
        controller: 'GroupCtrl',
        resolve:{
         groupModel: function(Group){
           return Group.query().$promise;
         }
        }
      })
      .state('group.confirmation', {
        url: '/confirmation',
        templateUrl: 'app/group/group-confirmation.html',
        controller: 'GroupConfirmCtrl',
        resolve:{
         Confirm: function(Confirmation){
          console.log(Confirmation)
          return Confirmation;
         }
        }
      });

      $urlRouterProvider.otherwise('/');
  });
