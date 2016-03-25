'use strict';

angular.module('gobeApp')
  .controller('FooterCtrl', function ($scope, $state, $location, Auth) {

    // $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    // $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.causesLink = function(){
      if(Auth.isAdmin()){
        $state.go('event.list');
      } else {
        $state.go('profile.event.list');
      }
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
