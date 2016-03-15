'use strict';

angular.module('gobeApp')
  .controller('ConfirmVolunteerCtrl', function ($scope, $state, $stateParams, Event, eventConfirm, groupConfirm) {
    $scope.event = eventConfirm;
    $scope.group = groupConfirm;

    var confirmedEmails = eventConfirm.confirmedEmails;
    var rejectedEmails = eventConfirm.rejectedEmails;
    $scope.confirm = false;
    $scope.reject = false;

    // console.log('confirmedEmails')
    // console.log(confirmedEmails)
    // console.log("stateParams response")
    // console.log($stateParams.response)

    console.log($stateParams.email)
    if($stateParams.email && ($stateParams.response === 'yes')){
      // check the confirmedEmails array if the current email already exists in array
      confirmedEmails.push($stateParams.email)
      $scope.confirm = true;
      var uniqueConfirmed = _.uniq(confirmedEmails)
      $scope.event.confirmedEmails = uniqueConfirmed;
      // console.log( $scope.event.confirmedEmails)
      Event.update({id: $stateParams.event_id}, $scope.event, function(data){
        console.log('data');
        // console.log(data);
      })
    }
    else if($stateParams.email && ($stateParams.response === 'no')){
      // check the rejectedEmails array if current email already exists in array

      rejectedEmails.push($stateParams.email)
      var uniqueRejected = _.uniq(rejectedEmails)
      $scope.reject = true;
      $scope.event.rejectedEmails = uniqueRejected;
      // console.log($scope.event.rejectedEmails)
      Event.update({id: $stateParams.event_id}, $scope.event, function(data){
        // console.log('data');
        // console.log(data);
      })
    }
  });
