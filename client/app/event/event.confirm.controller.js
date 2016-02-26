'use strict';

angular.module('gobeApp')
  .controller('EventConfirmCtrl', function ($scope, $state, $stateParams, Event, eventConfirm) {
    console.log("EventConfirmCtrl")
    console.log(eventConfirm)

    $scope.event = eventConfirm;

    var timeArray = ["8am and 12pm", "12pm and 5pm", "5pm and 8pm"];

    $scope.checkTime = function(time, index) {
      
        if(time && (index === 0)){
          return timeArray[0];
        }
        if(time && (index === 1)){
          return timeArray[1];
        }
        if(time && (index === 2)){
          return timeArray[2];
        }
    };

    //ng-click submit on a tag
    //function to confirm the group and time 
    //update the event model
    //confirmedDate, confirmedTime, confirmedGroup

    $scope.confirmGroupTime = function(date, time){
      console.log(date)
      console.log(time.replace(" and ", "-"))
      console.log($stateParams.group_id)
      var confirmTime = time.replace(" and ", "-");
      $scope.event.confirmGroup = $stateParams.group_id;
      $scope.event.confirmDate = date;
      $scope.event.confirmTime = confirmTime;

      Event.update({id: $stateParams.event_id }, $scope.event,
        function(data){
          console.log("data")
          console.log(data)
           // $state.go('event.list')
          }),
          function(err){
            // $scope.addEventError = "Looks like something went wrong! Please try again"
          }

    }

    //firstDate
    //ng-repeat over firstDateTime

    //secondDate
    //ng-repeat over secondDateTime

    //thirdDate
    //ng-repeat over thirdDateTime



  	// $scope.listEvents = eventModel;

   //  $scope.newEvent = {};
   //  $scope.newEvent.availability = {};

   //  $scope.newEvent.availability.firstDateTime = [false, false, false];
   //  $scope.newEvent.availability.secondDateTime = [false, false, false];
   //  $scope.newEvent.availability.thirdDateTime = [false, false, false];


   //  $scope.addEvent = function addEvent(form) {
   //  	console.log(form)
   //    $scope.submitted = true;
   //       if(form.$valid){
   //           Event.save($scope.newEvent,
   //             function(data){
   //                $state.go('event.list')
   //               }),
   //               function(err){
   //               	$scope.addEventError = "Looks like something went wrong! Please try again"
   //               }
   //             }
   //       else{
   //           document.body.scrollTop = document.documentElement.scrollTop = 0;
   //       }
   //  };



  });