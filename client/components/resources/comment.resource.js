'use strict';

angular.module('gobeApp')
.factory('Comment', function ($resource) {
    return $resource('api/comments/:id', { id: '@_id' },
          {
             update: {
                 method: 'PUT'
             }
             
  });
});