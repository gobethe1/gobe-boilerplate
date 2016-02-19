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
      // $stateParams.firstName = $scope.newGroup.firstName;
      console.log("stateParams")
      console.log($stateParams)


      $scope.submitted = true;
         if(form.$valid){
             Group.save($scope.newGroup,
               function(data){
                  $state.go('group.confirmation', 
                    {confirm: [$scope.newGroup.organizationName, $scope.newGroup.firstName,
                               $scope.newGroup.lastName, $scope.newGroup.phone,
                               $scope.newGroup.email, $scope.newGroup.zipCode]})
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


  .controller('GroupConfirmCtrl', function ($scope, $state, $stateParams) {
    console.log("firing")
   // console.log(Confirm)
     console.log($stateParams)
     console.log($stateParams[0])
     console.log($stateParams[0])
     $scope.orgName = $stateParams[0];
     $scope.firstName $stateParams[1];
     $scope.lastName = $stateParams[2];
     $scope.phone = $stateParams[3];
     $scope.email = $stateParams[4];
     $scope.zipCode = $stateParams[5];
  });
