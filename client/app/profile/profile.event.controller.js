'use strict';

angular.module('gobeApp')
  .controller('ProfileEventCtrl', function ($scope, $state, $stateParams, Event, eventModel, currentUser, userGroup) {
    $scope.checkMatchedArray = function(value, index) {
      return event.zipCode && userGroup.matchZipCodeArr.indexOf(event.zipCode) !== -1;
    }

    console.log('user group: ', userGroup)

    if(userGroup){
      var userZipCode = userGroup.zipCode;
      var matchZipCodeArr = userGroup._id;
    }
    $scope.listEvents = eventModel;
    $scope.hover = true;
    $scope.allZipCode = {'confirmGroup': null};
    $scope.matchedZipCode =  {'confirmGroup': matchZipCodeArr};
    $scope.showLink = 'profile.event.show';

    $scope.confirmGroupStatus = function(event){
      if(!event.confirmGroup){
        return false;
      }
      else if(event.confirmGroup){
        return true;
      }
    };

});
