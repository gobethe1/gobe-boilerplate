'use strict';

angular.module('gobeApp')
  .controller('GroupCtrl', function ($scope, $state, Group, groupModel, $stateParams) {
    $scope.listGroups = groupModel;

    $scope.newGroup = {};

    $scope.addGroup = function addGroup(form) {
      console.log(form)
      console.log("newGroup")
      console.log($scope.newGroup)
      $scope.newGroup = $scope.newGroup
      $stateParams.firstName = $scope.newGroup.firstName;
      console.log("stateParams")
      console.log($stateParams)


      $scope.submitted = true;
         if(form.$valid){
             Group.save($scope.newGroup,
               function(data){
                  $state.go('group.confirmation')
                 }),
                 function(err){
                  $scope.addGroupError = "Looks like something went wrong! Please try again"
                 }
               }
         else{
             document.body.scrollTop = document.documentElement.scrollTop = 0;
         }
    };
  })


  .controller('GroupConfirmCtrl', function ($scope, $state, $stateParams, Confirm) {
    console.log("firing")
   console.log(Confirm)
  });
