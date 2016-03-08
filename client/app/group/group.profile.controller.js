'use strict'

angular.module('gobeApp')
  .controller('GroupProfileCtrl', function ($scope, $stateParams, Group, groupProfile, currentUser) {
    $scope.currentUser = currentUser;
  	console.log("currentUser")
  	console.log(currentUser)
  	console.log(groupProfile)
    $scope.group = groupProfile;

  });
