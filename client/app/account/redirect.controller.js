'use strict';

angular.module('gobeApp')
  .controller('RedirectCtrl', function ($scope, $state, $http, Auth, User, currentUser) {
    console.log('hello standby')
    console.log(currentUser)
    console.log(currentUser.groupId)

    if(currentUser.role === "admin"){
      $state.go('event.list');
    }
    else if(currentUser.role === "user"){
      $state.go('group.profile')
    }
  });
