'use strict';

angular.module('gobeApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'ui.mask',
  'angularPayments',
  'rzModule',
  'google.places'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $windowProvider) {
    var $window = $windowProvider.$get();

    // if($window.location.hostname === 'www.getgobe.com'){
      $window.Stripe.setPublishableKey('pk_live_D3gze9OR9adAigqBpRtpp3Pa');
    // }
    // else{
    //   $window.Stripe.setPublishableKey('pk_test_LfZukS2wLTvKs3nJue3WPNyq');
    // }

    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    // $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
    // $httpProvider.defaults.withCredentials = true;
    // $httpProvider.defaults.useXDomain = true;
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        // console.log(config)
        // console.log(config.url)
        var str = config.url
        var configUrl = /www.zipcodeapi.com/
        var checkStr = configUrl.test(str)
        // console.log("checkStr")
        // console.log(checkStr)
        config.headers = config.headers || {};
        if ($cookieStore.get('token') && !checkStr) {
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

