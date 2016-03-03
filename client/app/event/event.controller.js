'use strict';

angular.module('gobeApp')
  .controller('EventCtrl', function ($scope, $state, $stateParams, Event, eventModel) {

  	$scope.listEvents = eventModel;
    $scope.hover = true;

    $scope.newEvent = {};
    $scope.newEvent.availability = {};

    $scope.newEvent.availability.firstDateTime = [false, false, false];
    $scope.newEvent.availability.secondDateTime = [false, false, false];
    $scope.newEvent.availability.thirdDateTime = [false, false, false];

    $scope.cancelClient = function cancelClient(){
      if(confirm("Are you sure you want to cancel this new client?")){
        $state.go('event.list');
      }
    }


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

    $scope.deleteEvent = function deleteEvent(id){
      if(confirm('Are you sure you want to delete this client?')){
        angular.forEach($scope.listEvents, function(e, i) {
          console.log('e')
          console.log(e)
           if (e._id === id) {
             $scope.listEvents.splice(i, 1);
           }
         });

        Event.remove({id: id });
      };
    }

});
