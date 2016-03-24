'use strict';

angular.module('gobeApp')
  .controller('ProfileCtrl', function ($scope, currentUser, Auth, Path) {
    $scope.user = currentUser;
    $scope.isAdmin = Auth.isAdmin;
    $scope.path = Path.transitionToPath;
  });
