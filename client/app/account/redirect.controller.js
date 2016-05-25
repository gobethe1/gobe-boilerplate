'use strict';

angular.module('gobeApp')
  .controller('RedirectCtrl', function ($scope, $state, $http, Auth, User, currentUser) {

    if(currentUser.role === "admin"){
      $state.go('event.list'); //event.list
    }
    else if((currentUser.position === "group") && currentUser.groupId){
      $state.go('group.list'); //group.profile
    }
    else if((currentUser.position === "group") && !currentUser.groupId){
      $state.go('group.list'); //group.new
    }
    else if(currentUser.position === "volunteer"){
      $state.go('profile.details');
    }
  });
