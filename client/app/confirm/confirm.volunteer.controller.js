'use strict';

angular.module('gobeApp')
  .controller('ConfirmVolunteerCtrl', function ($scope, $state, $stateParams, Event, eventConfirm, groupConfirm) {
    $scope.event = eventConfirm;
    $scope.group = groupConfirm;

    var confirmedEmails = eventConfirm.confirmedEmails;
    // console.log('confirmedEmails')
    // console.log(confirmedEmails)

    console.log($stateParams.email)
    if($stateParams.email){
      confirmedEmails.push($stateParams.email)
      $scope.event.confirmedEmails = confirmedEmails;
      console.log(confirmedEmails)
      Event.update({id: $stateParams.event_id}, $scope.event, function(data){
        console.log('data');
        console.log(data);
      })
    }
    else{
      $scope.sorryTaken = true;
    }


    // $scope.confirmGroupTime = function(date, time){
    //   var confirmTime = time.replace(" and ", "-");
    //   $scope.event.confirmGroup = $stateParams.group_id;
    //   $scope.event.confirmDate = date;
    //   $scope.event.confirmTime = confirmTime;

    //   //if confirmGroup, Date, Time, doesn't exist
    //   Event.update({id: $stateParams.event_id }, $scope.event,
    //     function(data){
    //       console.log("data")
    //       console.log(data)
    //       $scope.confirmGroup = true;
    //        // $state.go('event.list')
    //       }),
    //       function(err){
    //         // $scope.addEventError = "Looks like something went wrong! Please try again"
    //       }

    // }




  });
