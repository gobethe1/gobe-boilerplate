'use strict';

angular.module('gobeApp')
  .controller('GroupEditCtrl', function ($scope, $state, $stateParams, Group, groupEdit) {
    $scope.newGroup = groupEdit;
    $scope.emailList = $scope.newGroup.emailList;
    console.log($scope.newGroup);

    $scope.updateEmail = function addEmail(){
      $scope.emailList.push($scope.email);
      console.log('emailList');
      console.log($scope.emailList);
      $scope.email = null;
    };

    $scope.updateGroup = function addGroup(form) {
      var data = $scope.newGroup;
      $scope.submitted = true;
         if(form.$valid){
             Group.update({id: $stateParams.id }, data,
               function(data){
                  $state.go('group.list')
                 }),
                 function(err){
                  $scope.addEventError = "Looks like something went wrong! Please try again"
                 }
               }
         else{
             document.body.scrollTop = document.documentElement.scrollTop = 0;
         }
    };

  });
