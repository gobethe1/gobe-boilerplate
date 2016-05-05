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

    // $scope.passwordReset = function(form){
    //     $scope.submitted = true;
    //     var data = {email: $scope.user.email};
    //     if(form.$valid){
    //        $scope.spinner = true;
    //       $http.post('api/users/forgot', data)
    //         .success(function(data){
    //           $scope.successMessage = data;
    //           $scope.spinner = false;
    //           $location.path('/login');
    //         })
    //         .error(function(err){
    //           $scope.errors.other = err;
    //           $scope.spinner= false;
    //         })
    //     }
    //     $state.go('login');
    // };


    $scope.passwordReset = function(form){
        // $scope.submitted = true;
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
        console.log($stateParams.token)
        var data = {password: $scope.user.password, passwordConfirm: $scope.user.passwordConfirm};
        $http.post('/api/users/reset/' + $stateParams.token, data)
            .success(function(data){
              console.log(data)
              //on success send success message
              $scope.successMessage = data;
              $location.path('/login');

              // $scope.spinner = false;
            })
            .error(function(err){
                console.log(err)
                $scope.errors.other = err;
                // $scope.spinner = false;
            })

      }
        $state.go('login');
    };
  });
