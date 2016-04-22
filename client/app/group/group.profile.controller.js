'use strict'

angular.module('gobeApp')
  .controller('GroupProfileCtrl', function ($scope, $stateParams, Group, groupProfile, currentUser) {
    $scope.currentUser = currentUser;
    $scope.group = groupProfile;

  });
