'use strict';
'use strict';

angular.module('gobeApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $state, $rootScope, $stateParams) {

    $scope.title;
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.currentUrl = $location.path();
    $scope.stateParams = $stateParams;

    $scope.logout = function() {
      $scope.isCollapsed = !$scope.isCollapsed
      Auth.logout();
      $location.path('/login');
    };

    $scope.navTitle = function(location){
       var rawPath = location.path();
       var path = rawPath.replace(/^\/([^\/]*).*$/, '$1');
       if(path === 'group'){return "Groups"}
       if(path === 'profile'){return "Profile"}
       if(path === 'event'){return "Causes"}
       if(path === 'comment'){return "Feedback"}
       if((path === 'forgot') || (path === 'reset')){return "Reset Password"}
    }

    // $scope.goBack = function() {
    //   window.history.back();
    // };

    $scope.isActive = function(route) {
      return route === $location.path();
    };


  });
