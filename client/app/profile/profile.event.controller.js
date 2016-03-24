'use strict';

angular.module('gobeApp')
  .controller('ProfileEventCtrl', function ($scope, $state, $stateParams, Event, eventModel, currentUser, userGroup) {
    var userZipCode = userGroup.zipCode;
    var matchedZipCode = userGroup._id;
    $scope.listEvents = eventModel;
    $scope.hover = true;
    $scope.allZipCode = {'zipCode': userZipCode, 'confirmGroup': null};
    $scope.matchedZipCode =  {'confirmGroup': matchedZipCode};
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
