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
          $http.post('api/users/forgot', data)
            .success(function(data, err){
              $scope.successMessage = data;
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
            .success(function(data){
              //on success send success message
              $scope.successMessage = data;
              console.log($scope.successMessage);
            })
            .error(function(err){
                console.log(err)
                $scope.errors.other = err;
            })

      }
    };
  });
