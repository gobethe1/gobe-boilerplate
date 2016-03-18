'use strict';

angular.module('gobeApp')
 .factory('Event', function ($resource) {
    return $resource('api/events/:id/:controller', { id: '@_id' },
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
             sendupdate:{
                method: 'PUT',
                params: {
                  controller:'sendupdate'
                }
             }
  });
})


