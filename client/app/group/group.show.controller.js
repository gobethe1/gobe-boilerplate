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
    $scope.acceptedPastArray  = [];
    $scope.acceptedCurrentArray = [];
    $scope.returnValue     = [$scope.matchedArray, $scope.acceptedCurrentArray, $scope.acceptedPastArray];
    $scope.pastArray       = [];
    $scope.currentArray    = [];

    var checkMatchedArray = function(events){
        eventModel.forEach(function(event){
          if (event.published && !event.confirmGroup && groupShow.matchZipCodeArr.indexOf(event.zipCode) !== -1){
             $scope.matchedArray.push(event);
          }
          else if(event.published && event.confirmGroup === groupId && event.confirmDate >= Date.now()) {
             $scope.acceptedCurrentArray.push(event);
          } else if (event.published && event.confirmGroup === groupId && event.confirmDate < Date.now()) {
             $scope.acceptedPastArray.push(event);
          } else {
            return err
          }
        })
        console.log($scope.returnValue)
        return $scope.returnValue;
    };





    // console.log('matchedArray: ', $scope.matchedArray)
    // console.log('aaccepted matched: ', $scope.acceptedMatchedArray)
    // console.log('checkMatchedArray: ', checkMatchedArray())
    // console.log('pastArray: ', $scope.pastArray, 'currentArray: ', $scope.currentArray)
    // console.log('check if passed fx: ', checkIfEventPassed())


    // $scope.checkMatchedArray = function(event, index) {
    //   return event.published && !event.confirmGroup && userGroup.matchZipCodeArr.indexOf(event.zipCode) !== -1;
    // }

  });
