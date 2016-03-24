'use strict';

angular.module('gobeApp')
  .controller('ProfileCtrl', function ($scope, currentUser) {
    $scope.user = currentUser;
  });
