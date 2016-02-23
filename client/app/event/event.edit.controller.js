'use strict';

angular.module('gobeApp')
  .controller('EventEditCtrl', function ($scope, $state, $stateParams, Event, eventTest) {

  	// $scope.listEvents = eventModel;

   //  $scope.newEvent = {};
   //  $scope.newEvent.availability = {};

    // $scope.newEvent.availability.firstDateTime = [false, false, false];
    // $scope.newEvent.availability.secondDateTime = [false, false, false];
    // $scope.newEvent.availability.thirdDateTime = [false, false, false];

    // $scope.newEvent = Event.get({id: $stateParams.id});
    console.log(eventTest)
    $scope.newEvent = eventTest;
    console.log($scope.newEvent.availability.moveInDate)
    $scope.newEvent.availability.moveInDate = new Date($scope.newEvent.availability.moveInDate)
    // console.log(new Date($scope.newEvent.availability.moveInDate))
    $scope.newEvent.availability.firstDate = new Date($scope.newEvent.availability.firstDate )
    $scope.newEvent.availability.secondDate = new Date($scope.newEvent.availability.secondDate)
    $scope.newEvent.availability.thirdDate =  new Date($scope.newEvent.availability.thirdDate)


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
