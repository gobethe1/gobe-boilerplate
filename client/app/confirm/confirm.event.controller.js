'use strict';

angular.module('gobeApp')
  .controller('ConfirmEventCtrl', function ($scope, $state, $stateParams, Event, eventConfirm) {

    console.log('confirm email: ', $scope.confirmEmail);

    if(!eventConfirm.confirmGroup){
      $scope.event                  = eventConfirm;
      $scope.event.confirmDate;
      $scope.submitted              = false;
      $scope.event.confirmTime      = false
      $scope.event.confirmTimeOne   = false
      $scope.event.confirmTimeTwo   = false
      $scope.event.confirmTimeThree = false

      var morningArr    = [" 8:00 am", " 9:00 am", "10:00 am", "11:00 am", "12:00 pm"]
      var afternoonArr  = ["12:00 pm", " 1:00 pm", " 2:00 pm", " 3:00 pm", " 4:00 pm", " 5:00 pm"]
      var eveningArr    = [" 5:00 pm", " 6:00 pm", " 7:00 pm", " 8:00 pm"]

      $scope.checkTime = function(time) {
          var finalArr = [];

          if(time[0]){
            finalArr.push.apply(finalArr, morningArr);
          }
          if(time[1]){
            finalArr.push.apply(finalArr, afternoonArr);
          }
          if(time[2]){
            finalArr.push.apply(finalArr, eveningArr);
          }

          finalArr = _.uniq(finalArr)
          return finalArr;
       };
    }
    else{
      $scope.sorryTaken = true;
    }



    $scope.resetTime = function resetTime(date){
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
         $scope.event.confirmTime =  null;
         $scope.event.confirmGroup = null;
      }
    }


    $scope.confirmGroupTime = function(form){
      $scope.submitted = true;
      $scope.event.meetupAddress = $scope.event.meetupAddress.formatted_address;
      $scope.event.confirmGroup = $stateParams.group_id;

      if(form.$valid && $scope.event.confirmTime){
        Event.update({id: $stateParams.event_id }, $scope.event,
          function(data){
            $scope.confirmGroup = true;
            }),
            function(err){
              $scope.addEventError = "Looks like something went wrong! Please try again"
            }
      }

    }

    $scope.confirmIndividualTime = function(form){
      console.log('form: ', form)
      $scope.submitted = true;
      $scope.individual = $stateParams.user_id;
      console.log('confirm individual: ', $scope.individual)
      $scope.confirmIndividuals  = $scope.event.confirmIndividuals.push($scope.individual)
      console.log('confirm individuals: ', $scope.confirmIndividuals)

      if(form.$valid && $scope.event.confirmTime){
        Event.update({id: $stateParams.event_id }, $scope.event,
          function(data){
            $scope.confirmed = true;
            }),
            function(err){
              $scope.addEventError = "Looks like something went wrong! Please try again"
            }
      }

    }




  });
