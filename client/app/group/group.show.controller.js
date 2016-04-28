'use strict'

angular.module('gobeApp')
  .controller('GroupShowCtrl', function ($scope, $stateParams, Group, groupShow, currentUser, eventModel, Auth) {
    $scope.currentUser = currentUser;
  	console.log("currentUser")
  	console.log(currentUser)
    $scope.group = groupShow;
    $scope.events = eventModel
    console.log($scope.events)
    $scope.isAdmin = Auth.isAdmin;

    
    //filters
    var groupId = groupShow._id;
    $scope.matchedZipCode =  {'confirmGroup': groupId, 'published': true};

    $scope.checkMatchedArray = function(event, index) {
      return event.published && !event.confirmGroup && userGroup.matchZipCodeArr.indexOf(event.zipCode) !== -1;
    }

  });
