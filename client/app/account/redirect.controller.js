'use strict';

angular.module('gobeApp')
  .controller('RedirectCtrl', function ($scope, $state, $http, Auth, User, currentUser) {
    console.log('hello standby')
    console.log(currentUser)

    if(currentUser.role === "admin"){
      $state.go('group.list');
    }
    else if(currentUser.role === "user"){
      $state.go('group.profile')
    }
  });
