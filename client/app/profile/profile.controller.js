'use strict';

angular.module('gobeApp')
  .controller('ProfileCtrl', function ($scope, currentUser, Auth) {
    $scope.user = currentUser;
    $scope.isAdmin = Auth.isAdmin;
  });
