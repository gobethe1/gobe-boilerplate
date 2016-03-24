'use strict';

angular.module('gobeApp')
  .factory('Path', function Path(User, Auth, $state) {

    return {
      transitionToPath: function(path, id){
        return $state.go(path, {'id': id});
      }
    };

  });
