'use strict';

angular.module('gobeApp')
  .controller('EventEditCtrl', function ($scope, $state, $stateParams, Event, eventEdit) {


    $scope.newEvent = eventEdit;
    $scope.newEvent.availability.moveInDate = new Date($scope.newEvent.availability.moveInDate)
    $scope.newEvent.availability.firstDate = new Date($scope.newEvent.availability.firstDate )
    $scope.newEvent.availability.secondDate = new Date($scope.newEvent.availability.secondDate)
    $scope.newEvent.availability.thirdDate =  new Date($scope.newEvent.availability.thirdDate)

    $scope.publishEvent = function publishEvent(){
      $scope.newEvent.published = false;
      $scope.submitted = false;
      console.log('new event published');
      console.log($scope.newEvent.published)
      Event.save($scope.newEvent, function(data){
        $state.go('event.list');
      }),
      function(err){
        $scope.addEventError = "Looks like something went wrong! Please try again"
      }
    };

    $scope.updateEvent = function addEvent(form) {
      var data = $scope.newEvent;
      $scope.submitted = true;
      $scope.newEvent.published = true;
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

    $scope.cancelClient = function cancelClient(){
         if(confirm("Are you sure you want to cancel? All changes will be lost.")){
           $state.go('event.list');
         }
       }



  });
