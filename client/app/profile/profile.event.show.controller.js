'use strict';

angular.module('gobeApp')
  .controller('ProfileEventShowCtrl', function ($scope, $state, $stateParams, Event, Group, eventModel, currentUser, userGroup, Path, eventShow) {

    $scope.event = eventShow;
    $scope.confirmIndividuals = $scope.event.confirmIndividuals;
    $scope.group = userGroup;
    console.log('this is a test')
    console.log('event: ', $scope.event)
    console.log('event: ', $scope.confirmIndividuals)



    if(userGroup){
      var userZipCode = userGroup.zipCode;
      $scope.matchedZipCodeId = userGroup._id;
    }

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

    $scope.checkIndividual = function(event){
      if(($scope.confirmIndividuals.indexOf(currentUser._id)) == -1) {  //if not in array
        return true
      } else {
        return false;
      }
    }
    // console.log('check index: ', $scope.checkIndividual() );

});
