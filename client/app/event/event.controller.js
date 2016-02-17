'use strict';

angular.module('gobeApp')
  .controller('EventCtrl', function ($scope, Event, eventModel) {

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
                  console.log('we did it!');
                  console.log(data);
                 }),
                 function(err){
                  console.log('nah');
                  console.log(data);
                 }
               }
         else{
             document.body.scrollTop = document.documentElement.scrollTop = 0;
         }
    };



  });
