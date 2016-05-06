'use strict';

angular.module('gobeApp')
  .controller('SettingsCtrl', function ($scope, User, Auth, $http, $stateParams, $state, $location) {
    $scope.errors = {};
    $scope.stateParams = $stateParams;

    console.log($scope.stateParams)

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};


    $scope.passwordReset = function(form){
        $scope.submitted = true;
        var data = {email: $scope.user.email};
        if(form.$valid){
          $http.post('/api/users/forgot', data)
            .success(function(data){
              // $scope.successMessage = "Password successfully changed";
            })
            .error(function(err){
              $scope.errors.other = err;
            })
        }
        $state.go('confirmation');
    };



    $scope.newPasswordReset = function(form){
      $scope.submitted = true;

      if(form.$valid){
        var data = {password: $scope.user.password, passwordConfirm: $scope.user.passwordConfirm};
        $http.post('/api/users/reset/' + $stateParams.token, data)
            .then(function(data) {
              console.log('hello in the promise!')
              // console.log($location.path)
              $scope.successMessage = true;
            })
            .catch(function(){
              $scope.errors.other = "Your password reset link is either invalid or has expired.";
              console.log($scope.errors.other)
            })

      }

    };

  });
