'use strict';

angular.module('gobeApp')
  .controller('ProfileEventShowCtrl', function ($scope, $state, $stateParams, Event, eventModel, currentUser, userGroup) {
    $scope.transitionToShow = function(path, id){
      $state.go(path, {'id': id});
    };

    $scope.confirmGroupStatus = function(event){
      if(!event.confirmGroup){
        return false;
      }
      else if(event.confirmGroup){
        return true;
      }
    };

});
