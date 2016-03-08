'use strict';

angular.module('gobeApp')
  .controller('SignupCtrl', function ($scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};
    $scope.tab = 1;

    console.log($scope.tab)


    $scope.setTab = function (tabId) {
        $scope.tab = tabId;
      console.log($scope.tab)
    };

    $scope.isSet = function (tabId) {

        return $scope.tab === tabId;
    };

    $scope.signup = function(form) {
      $scope.submitted = true;
      console.log(form)
      console.log("signup firing")
      console.log(form.$valid)
      if(form.$valid) {
        Auth.createUser({
          firstName: $scope.user.firstName,
          lastName: $scope.user.lastName,
          groupName: $scope.user.groupName,
          email: $scope.user.email,
          password: $scope.user.password,
          zipCode: $scope.user.zipCode
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/group/new');
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
