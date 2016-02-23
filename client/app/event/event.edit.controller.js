'use strict';

angular.module('gobeApp')
  .controller('EventEditCtrl', function ($scope, $state, $stateParams, Event, eventTest) {


    $scope.newEvent = eventTest;
    $scope.newEvent.availability.moveInDate = new Date($scope.newEvent.availability.moveInDate)
    $scope.newEvent.availability.firstDate = new Date($scope.newEvent.availability.firstDate )
    $scope.newEvent.availability.secondDate = new Date($scope.newEvent.availability.secondDate)
    $scope.newEvent.availability.thirdDate =  new Date($scope.newEvent.availability.thirdDate)


    $scope.updateEvent = function addEvent(form) {
      console.log("updateEvent")
      console.log($scope.newEvent)
      var data = $scope.newEvent;
    	console.log(data)
      $scope.submitted = true;
         if(form.$valid){
             Event.update({id: $stateParams.id }, data,
               function(data){
                console.log("data")
                 console.log(data)
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
