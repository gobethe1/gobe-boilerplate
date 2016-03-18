'use strict';

angular.module('gobeApp')
  .controller('EventCtrl', function ($scope, $state, $stateParams, Event, eventModel, currentUser) {
    // console.log(currentUser)
  	$scope.listEvents = eventModel;
    $scope.hover = true;
    $scope.newEvent = {};
    $scope.newEvent.availability = {};

    $scope.newEvent.availability.firstDateTime = [false, false, false];
    $scope.newEvent.availability.secondDateTime = [false, false, false];
    $scope.newEvent.availability.thirdDateTime = [false, false, false];
    $scope.newEvent.userId = currentUser._id;

    $scope.confirmGroupStatus = function(event){
      if(!event.confirmGroup){
        return false;
      }
      else if(event.confirmGroup){
        return true;
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
    };

    $scope.addEvent = function addEvent(){
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

    $scope.publishEvent = function publishEvent(form) {
      console.log(form)
        console.log('published')
        $scope.newEvent.published = true;
        $scope.submitted = true;
        console.log($scope.newEvent.published);
           if(form.$valid){
               Event.send($scope.newEvent,
                 function(data){
                    // console.log(data)
                    $state.go('event.list')
                   }),
                   function(err){
                   	$scope.publishEventError = "Looks like something went wrong! Please try again"
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
          // console.log(e)
           if (e._id === id) {
             $scope.listEvents.splice(i, 1);
           }
         });

        Event.remove({id: id });
      };
    }

});
