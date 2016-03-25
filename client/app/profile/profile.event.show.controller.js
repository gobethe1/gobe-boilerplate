'use strict';

angular.module('gobeApp')
  .controller('ProfileEventShowCtrl', function ($scope, $state, $stateParams, Event, eventModel, currentUser, userGroup, Path, eventShow) {
    
    $scope.event = eventShow;
    var userZipCode = userGroup.zipCode;
    $scope.matchedZipCodeId = userGroup._id;
    $scope.group = userGroup;

    var timeArray = ["8am-12pm", "12pm-5pm", "5pm-8pm"];

    $scope.checkTime = function(time, index) {
      
        if(time && (index === 0)){
          return timeArray[0];
        }
        if(time && (index === 1)){
          return timeArray[1];
        }
        if(time && (index === 2)){
          return timeArray[2];
        }
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
