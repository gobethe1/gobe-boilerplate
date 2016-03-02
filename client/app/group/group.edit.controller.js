'use strict';

angular.module('gobeApp')
  .controller('GroupEditCtrl', function ($scope, $state, $stateParams, Group, groupEdit) {
    $scope.newGroup = groupEdit;
    console.log($scope.newGroup);

    $scope.updateGroup = function addGroup(form) {
      var data = $scope.newGroup;
      $scope.submitted = true;
         if(form.$valid){
             Group.update({id: $stateParams.id }, data,
               function(data){
                  $state.go('group.list')
                 }),
                 function(err){
                  $scope.addGroupError = "Looks like something went wrong! Please try again"
                 }
               }
         else{
             document.body.scrollTop = document.documentElement.scrollTop = 0;
         }
    };
  });
