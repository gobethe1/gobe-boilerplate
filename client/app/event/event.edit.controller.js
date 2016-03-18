'use strict';

angular.module('gobeApp')
  .controller('EventEditCtrl', function ($scope, $state, $stateParams, Event, eventEdit) {


    $scope.newEvent = eventEdit;
    $scope.newEvent.availability.moveInDate = new Date($scope.newEvent.availability.moveInDate)
    $scope.newEvent.availability.firstDate = new Date($scope.newEvent.availability.firstDate )
    $scope.newEvent.availability.secondDate = new Date($scope.newEvent.availability.secondDate)
    $scope.newEvent.availability.thirdDate =  new Date($scope.newEvent.availability.thirdDate)

    $scope.updateEvent = function updateEvent(form){
      $scope.newEvent.published = false;
      $scope.submitted = false;
      console.log('new event published');
      console.log($scope.newEvent.published)
        Event.save({id: $stateParams.id},
             function(data){
                console.log('data')
                console.log(data)
                  $state.go('event.list')
                 }),
             function(err){
              $scope.addEventError = "Looks like something went wrong! Please try again"
             }
    };

    $scope.publishEvent = function publishEvent(form) {
      console.log('form')
      console.log(form)
      var data = $scope.newEvent;
      $scope.submitted = true;
      $scope.newEvent.published = true;
         if(form.$valid){
             Event.sendupdate({id: $stateParams.id }, data,
               function(data){
                console.log('data')
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

    $scope.cancelClient = function cancelClient(form){
      if(form.$pristine){
          $state.go('event.list');
        } else {
           if(confirm("Are you sure you want to cancel? All changes will be lost.")){
             $state.go('event.list');
           }
        }
      }



  });
