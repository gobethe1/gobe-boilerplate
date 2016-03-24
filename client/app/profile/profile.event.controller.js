'use strict';

angular.module('gobeApp')
  .controller('ProfileEventCtrl', function ($scope, $state, $stateParams, Event, eventModel, currentUser, userGroup) {
    console.log(currentUser)
    console.log(eventModel)
    $scope.listEvents = eventModel;
    $scope.hover = true;
    $scope.newEvent = {};
    $scope.newEvent.availability = {};

    var userZipCode = userGroup.zipCode;
    // var confirmGroupNull =
    var matchedZipCode = userGroup._id;

    console.log('userGroup', userGroup, 'userZipCode', userZipCode)

    $scope.allZipCode = {'zipCode': userZipCode, 'confirmGroup': null};
    $scope.matchedZipCode =  {'confirmGroup': matchedZipCode};
    // $scope.unpublished = {'published': false};

    $scope.newEvent.availability.firstDateTime = [false, false, false];
    $scope.newEvent.availability.secondDateTime = [false, false, false];
    $scope.newEvent.availability.thirdDateTime = [false, false, false];
    $scope.newEvent.userId = currentUser._id;

    $scope.confirmGroupStatus = function(event){
      if(!event.confirmGroup){
        return false;
      }
      else if(event.confirmGroup){
        return true;
      }
    };

});
