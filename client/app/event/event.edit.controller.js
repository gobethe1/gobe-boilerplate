'use strict';

angular.module('gobeApp')
  .controller('EventEditCtrl', function ($scope, $state, $stateParams, Event, eventTest) {


    $scope.newEvent = eventTest;
    $scope.newEvent.availability.moveInDate = new Date($scope.newEvent.availability.moveInDate)
    $scope.newEvent.availability.firstDate = new Date($scope.newEvent.availability.firstDate )
    $scope.newEvent.availability.secondDate = new Date($scope.newEvent.availability.secondDate)
    $scope.newEvent.availability.thirdDate =  new Date($scope.newEvent.availability.thirdDate)


    $scope.updateEvent = function addEvent(form) {
      var data = $scope.newEvent;
      $scope.submitted = true;
         if(form.$valid){
             Event.update({id: $stateParams.id }, data,
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
