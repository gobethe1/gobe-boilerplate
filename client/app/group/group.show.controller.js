'use strict'

angular.module('gobeApp')
  .controller('GroupShowCtrl', function ($scope, $stateParams, Group, groupShow, currentUser) {

  	console.log("currentUser")
  	console.log(currentUser)
    $scope.group = groupShow;

  });
