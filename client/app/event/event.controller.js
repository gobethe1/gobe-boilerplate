'use strict';

angular.module('gobeApp')
  .controller('EventCtrl', function ($scope, $state, Event, eventModel) {

  	$scope.listEvents = eventModel;

    $scope.newEvent = {};
    $scope.newEvent.availability = {};
    
    $scope.newEvent.availability.firstDateTime = [false, false, false];
    $scope.firstTimeValid = !$scope.newEvent.availability.firstDateTime[0] && !$scope.newEvent.availability.firstDateTime[1] && !$scope.newEvent.availability.firstDateTime[2]

    $scope.newEvent.availability.secondDateTime = [false, false, false];
    $scope.secondTimeValid = !$scope.newEvent.availability.secondDateTime[0] && !$scope.newEvent.availability.secondDateTime[1] && !$scope.newEvent.availability.secondDateTime[2]

    $scope.newEvent.availability.thirdDateTime = [false, false, false];
    $scope.thirdTimeValid = !$scope.newEvent.availability.thirdDateTime[0] && !$scope.newEvent.availability.thirdDateTime[1] && !$scope.newEvent.availability.thirdDateTime[2]

    $scope.addEvent = function addEvent(form) {
    	console.log(form)
      $scope.submitted = true;
         if(form.$valid){
             Event.save($scope.newEvent,
               function(data){
                  $state.go('event.list')
                 }),
                 function(err){
                 	$scope.addEventError = "Looks like something went wrong! Please try again"
                 }
               }
         else{
             document.body.scrollTop = document.documentElement.scrollTop = 0;
         }
    };



  });
