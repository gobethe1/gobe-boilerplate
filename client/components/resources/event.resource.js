'use strict';

angular.module('gobeApp')
 .factory('Event', function ($resource) {
    return $resource('api/events/:id', { id: '@_id' },
          {
             update: {
                 method: 'PUT'
             }
  });
});
