'use strict';

angular.module('gobeApp')
.factory('Group', function ($resource) {
    return $resource('api/groups/:id', { id: '@_id' },
          {
             update: {
                 method: 'PUT'
             },
             send:{
             	method: 'POST',
             	params: {
             	  id:'send'
             	}
             },
  });
});