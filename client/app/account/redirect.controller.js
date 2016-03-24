'use strict';

angular.module('gobeApp')
  .controller('RedirectCtrl', function ($scope, $state, $http, Auth, User, currentUser) {

    if(currentUser.role === "admin"){
      $state.go('profile.details'); //event.list
    }
    else if((currentUser.position === "group") && currentUser.groupId){
      $state.go('profile.details'); //group.profile
    }
    else if((currentUser.position === "group") && !currentUser.groupId){
      $state.go('profile.details'); //group.new
    }
    else if(currentUser.position === "volunteer"){
      $state.go('volunteer.profile');
    }
  });
