'use strict';

angular.module('gobeApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      createSubscription: {
        method: 'POST',
        params: {
          id: 'subscription'
        }
      },
      retrieveCustomer: {
        method: 'GET',
        params:{
          controller: 'customer'
        }
      }
	  });
  });
