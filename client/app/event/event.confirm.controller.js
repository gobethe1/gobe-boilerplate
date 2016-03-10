'use strict';

angular.module('gobeApp')
  .controller('EventConfirmCtrl', function ($scope, $state, $stateParams, Event, eventConfirm) {
    console.log("EventConfirmCtrl")
    console.log(eventConfirm)
    console.log(eventConfirm.confirmGroup)

    if(!eventConfirm.confirmGroup){
      $scope.event = eventConfirm;
    }
    else{
      $scope.sorryTaken = true;
    }

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


    $scope.confirmGroupTime = function(date, time){
      var confirmTime = time.replace(" and ", "-");
      $scope.event.confirmGroup = $stateParams.group_id;
      $scope.event.confirmDate = date;
      $scope.event.confirmTime = confirmTime;

      //if confirmGroup, Date, Time, doesn't exist
      Event.update({id: $stateParams.event_id }, $scope.event,
        function(data){
          console.log("data")
          console.log(data)
          $scope.confirmGroup = true;
           // $state.go('event.list')
          }),
          function(err){
            // $scope.addEventError = "Looks like something went wrong! Please try again"
          }

    }




  });
