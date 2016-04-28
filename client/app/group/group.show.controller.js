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

    $scope.matchedArray    = [];
    $scope.acceptedMatchedArray  = [];
    $scope.returnValue     = [$scope.matchedArray, $scope.acceptedMatchedArray];

    var checkMatchedArray = function(events){
        eventModel.forEach(function(event){
          if (event.published && !event.confirmGroup && groupShow.matchZipCodeArr.indexOf(event.zipCode) !== -1){
             $scope.matchedArray.push(event);
          }
          else if(event.published && event.confirmGroup === groupId) {
             $scope.acceptedMatchedArray.push(event);
          }
        })
        return $scope.returnValue;
    };

    console.log('checkMatchedArray: ', checkMatchedArray(), 'matchedArray: ', $scope.matchedArray)


    // $scope.checkMatchedArray = function(event, index) {
    //   return event.published && !event.confirmGroup && userGroup.matchZipCodeArr.indexOf(event.zipCode) !== -1;
    // }

  });
