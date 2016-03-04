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
      .state('group.show', {
        url: '/:id/show',
        templateUrl: 'app/group/group-show.html',
        controller: 'GroupShowCtrl',
        resolve:{
        groupShow: function(Group, $stateParams){
           return Group.get({id: $stateParams.id}).$promise;
         }
        }
      })
       .state('group.edit', {
        url: '/:id/edit',
        templateUrl: 'app/group/group-edit.html',
        controller: 'GroupEditCtrl',
        resolve:{
         groupEdit: function(Group, $stateParams){
           return Group.get({id: $stateParams.id}).$promise;
         }
        }
      })
      .state('group.confirmation', {
        url: '/confirmation/:confirm',
        templateUrl: 'app/group/group-show.html',
        controller: 'GroupConfirmCtrl',
        params: confirm,
        resolve:{
        groupShow: function(Group, $stateParams){
           return Group.get({id: $stateParams.confirm}).$promise;
         }
        }
      });

      $urlRouterProvider.otherwise('/');
  });
