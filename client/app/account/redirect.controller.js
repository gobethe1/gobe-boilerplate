'use strict';

angular.module('gobeApp')
  .controller('RedirectCtrl', function ($scope, $state, $http, Auth, User, currentUser) {
    console.log('hello standby')
    console.log(currentUser)
    console.log(currentUser.groupId)

    if(currentUser.role === "admin"){
      $state.go('event.list');
    }
    else if((currentUser.position === "group") && currentUser.groupId){
      $state.go('group.profile');
    }
    else if((currentUser.position === "group") && !currentUser.groupId){
      $state.go('group.new');
    }
    else if(currentUser.position === "volunteer"){
      $state.go('volunteer.profile');
    }
  });
