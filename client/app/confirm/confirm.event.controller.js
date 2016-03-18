'use strict';

angular.module('gobeApp')
  .controller('ConfirmEventCtrl', function ($scope, $state, $stateParams, Event, eventConfirm) {
    // console.log("EventConfirmCtrl")
    // console.log(eventConfirm)
    // console.log(eventConfirm.confirmGroup)


    if(!eventConfirm.confirmGroup){
      $scope.event = eventConfirm;
      $scope.event.confirmDate;
    }
    else{
      $scope.sorryTaken = true;
    }

    var morningArr = [" 8:00 am", " 9:00 am", "10:00 am", "11:00 am", "12:00 pm"]
    var afternoonArr = ["12:00 pm", " 1:00 pm", " 2:00 pm", " 3:00 pm", " 4:00 pm", " 5:00 pm"]
    var eveningArr = [" 5:00 pm", " 6:00 pm", " 7:00 pm", " 8:00 pm"]
    // 
    $scope.firstTimes = _.range(8, 13);

    var timeArray = ["8am and 12pm", "12pm and 5pm", "5pm and 8pm"];

    $scope.checkTime = function(time) {
        // console.log("checkTime")
        // console.log(time)
        // console.log(time[0])
        // console.log(time[1])
        // console.log(time[2])
        var finalArr = [];

        if(time[0]){
          // console.log("morning")
          finalArr.push.apply(finalArr, morningArr);
          // console.log(finalArr)
        }
        if(time[1]){
          // console.log("afternoon")
          finalArr.push.apply(finalArr, afternoonArr);
          // console.log(finalArr)
        }
        if(time[2]){
          // console.log("evening")
          finalArr.push.apply(finalArr, eveningArr);
        }

        finalArr = _.uniq(finalArr)
        // console.log(finalArr)
        return finalArr;
    };

    $scope.resetTime = function resetTime(date){
       console.log(date)
       if(date === 'dateOne'){
        $scope.event.confirmTimeTwo = null
        $scope.event.confirmTimeThree = null
       }
       if(date === 'dateTwo'){
        $scope.event.confirmTimeOne = null
        $scope.event.confirmTimeThree = null
       }
      if(date === 'dateThree'){
        $scope.event.confirmTimeOne = null
        $scope.event.confirmTimeTwo = null
       }
       if(date === 'none'){
         $scope.event.confirmTimeOne = null
         $scope.event.confirmTimeTwo = null
         $scope.event.confirmTimeThree = null
      }
    }


    $scope.confirmGroupTime = function(form){
      // var confirmTime = time.replace(" and ", "-");
      $scope.event.confirmGroup = $stateParams.group_id;
      // $scope.event.confirmDate = date;
      $scope.event.confirmTime =  $scope.event.confirmTimeOne ||  $scope.event.confirmTimeTwo ||  $scope.event.confirmTimeThree ;
      console.log($scope.event.confirmTime)
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
