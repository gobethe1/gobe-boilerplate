'use strict';

angular.module('gobeApp')
  .controller('GroupEditCtrl', function ($scope, $state, $stateParams, Group, groupEdit) {
    $scope.group = groupEdit;
    console.log($scope.group);
  });
