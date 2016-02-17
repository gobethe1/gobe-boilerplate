'use strict';

angular.module('gobeApp')
  .controller('EventCtrl', function ($scope, $state, Event, eventModel) {

  	$scope.listEvents = eventModel;

    $scope.newEvent = {};
    $scope.newEvent.availability = {};
    $scope.newEvent.availability.firstDateTime = [false, false, false];
    $scope.newEvent.availability.secondDateTime = [false, false, false];
    $scope.newEvent.availability.thirdDateTime = [false, false, false];

    $scope.addEvent = function addEvent(form) {
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
