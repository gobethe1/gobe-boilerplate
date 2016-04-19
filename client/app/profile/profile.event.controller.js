'use strict';

angular.module('gobeApp')
  .controller('ProfileEventCtrl', function ($scope, $state, $stateParams, Event, eventModel, currentUser, userGroup) {
    
    $scope.checkMatchedArray = function(event, index) {
      return event.published && !event.confirmGroup && userGroup.matchZipCodeArr.indexOf(event.zipCode) !== -1;
    }

    if(userGroup){
      var groupId = userGroup._id;
    }
    
    $scope.listEvents = eventModel;
    $scope.hover = true;
    $scope.matchedZipCode =  {'confirmGroup': groupId, 'published': true};
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
