'use strict';

angular.module('gobeApp')
  .controller('FooterCtrl', function ($scope, $state, $location, Auth, $rootScope) {

    // $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    // $scope.currentUrl = $location.path();
    // $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.causesLink = function(){
      if(Auth.isAdmin()){
        $state.go('event.list');
      } else {
        $state.go('profile.event.list');
      }
    };

    $scope.isActive = function(route) {
      var currentLocation = $location.path().replace(/^\/([^\/]*).*$/, '$1');
      var path = route.replace(/^\/([^\/]*).*$/, '$1');
      // console.log('route', route, 'current location', currentLocation, 'path', path)
      return currentLocation === path;
    };
  });
