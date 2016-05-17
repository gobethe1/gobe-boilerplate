'use strict';

angular.module('gobeApp')
  .controller('SignupCtrl', function ($scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};
    $scope.tab = 1;
    $scope.zipCode = "99999";
    $scope.user.position = "volunteer";

    // console.log($scope.tab)


    $scope.setTab = function (tabId) {
        $scope.tab = tabId;
        if (tabId === 1){$scope.user.position = "group"}
        else if (tabId === 2){$scope.user.position = "volunteer"}
        // console.log($scope.user.position)
    };

    $scope.isSet = function (tabId) {
        return $scope.tab === tabId;
    };

    $scope.signup = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.createUser({
          email: $scope.user.email,
          password: $scope.user.password,
          position: $scope.user.position,
          firstName: $scope.user.firstName,
          lastName: $scope.user.lastName
        })
        .then( function() {
          if($scope.user.position === "group"){
              $location.path('/group/list');
            }
           else if($scope.user.position === 'volunteer'){
              $location.path('/volunteer/signup');
           }
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
