'use strict';

angular.module('gobeApp')
  .controller('FooterCtrl', function ($scope, $state, $location, Auth, $rootScope) {

    // $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    // $scope.currentUrl = $location.path();
    // $scope.getCurrentUser = Auth.getCurrentUser;

    // fx to handle isAdmin and send non-admin user to profile views instead of event viewss
    // use ng-click on navbar.html and footer.html to re-implement

    // $scope.causesLink = function(){
    //   if(Auth.isAdmin()){
    //     $state.go('event.list');
    //   } else {
    //     $state.go('profile.event.list');
    //   }
    // };

    $scope.isActive = function(route) {
      if(route === '/profile/event/list' || route === '/profile/details'){
         return route === $location.path();
      }
      else{
        var currentLocation = $location.path().replace(/^\/([^\/]*).*$/, '$1');
        var path = route.replace(/^\/([^\/]*).*$/, '$1');
        return currentLocation === path;
      }
    };

  });
