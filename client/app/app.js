'use strict';

angular.module('gobeApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'ui.mask',
  'angularPayments'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $windowProvider) {
    var $window = $windowProvider.$get();

    if($window.location.hostname === 'try.gobethe1.com'){
      $window.Stripe.setPublishableKey('pk_live_D3gze9OR9adAigqBpRtpp3Pa');
    }
    else{
      $window.Stripe.setPublishableKey('pk_test_LfZukS2wLTvKs3nJue3WPNyq');
    }
    
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth, $state) {

    $rootScope.currentLocation = $location
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        var admin = Auth.isAdmin();
        var activeSubscription = Auth.activeSubscription();

        if(!admin && next.adminProtected && loggedIn){
            event.preventDefault();
           $location.path('/');
        }
        if(!admin && next.activeSubscription && !activeSubscription && loggedIn){
            event.preventDefault();
            $location.path('/group/list')
        }
        if(next.loginPrevent && loggedIn){
           event.preventDefault();
           $location.path('/profile/details');
        }
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          $location.path('/login');
        }
      });
    });
  });

