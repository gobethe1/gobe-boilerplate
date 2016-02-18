'use strict';

angular.module('gobeApp')
  .controller('GroupCtrl', function ($scope, $state) {
    // $scope.listGroups = groupModel;

    $scope.newGroup = {};

    // $scope.addGroup = function addGroup(form) {
    //   console.log(form)
    //   $scope.submitted = true;
    //      if(form.$valid){
    //          Group.save($scope.newGroup,
    //            function(data){
    //               $state.go('group.list')
    //              }),
    //              function(err){
    //               $scope.addGroupError = "Looks like something went wrong! Please try again"
    //              }
    //            }
    //      else{
    //          document.body.scrollTop = document.documentElement.scrollTop = 0;
    //      }
    // };
  });
