'use strict'

angular.module('gobeApp')
  .controller('GroupShowCtrl', function ($scope, $stateParams, Group, groupShow) {

    $scope.group = groupShow;

  });
