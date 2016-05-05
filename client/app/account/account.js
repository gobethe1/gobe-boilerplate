'use strict';

angular.module('gobeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl',
        loginPrevent: true
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl',
        loginPrevent: true
      })
      .state('redirect', {
        url: '/redirect',
        controller: 'RedirectCtrl',
        resolve: {
          currentUser: function(Auth){
            return Auth.getCurrentUser().$promise;
          }
        }
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .state('forgot', {
        url: '/forgot',
        templateUrl: 'app/account/settings/forgot-password.html',
        controller: 'SettingsCtrl'
      })
      .state('confirmation', {
        url: '/confirmation',
        templateUrl: 'app/account/settings/forgot-password-confirmation.html',
        controller: 'SettingsCtrl'
      })
      .state('reset', {
        url: '/reset/:token',
        templateUrl: 'app/account/settings/reset-password.html',
        controller: 'SettingsCtrl'
      })
  });
