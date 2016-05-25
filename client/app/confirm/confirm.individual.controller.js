'use strict';

angular.module('gobeApp')
  .controller('ConfirmIndividualCtrl', function ($scope, $state, $stateParams, Event, eventConfirm) {
    $scope.event = eventConfirm;
    // console.log('state: ', $stateParams.user_id)
    // console.log('event: ', $stateParams.event_id)
    // console.log('scope event: ', $scope.event)

    $scope.confirmIndividualTime = function(form){
      $scope.submitted = true;
      $scope.individual = $stateParams.user_id;
      $scope.confirmIndividuals  = $scope.event.confirmIndividuals.push($scope.individual)
      // if(form.$valid){
        Event.update({id: $stateParams.event_id }, $scope.event,
          function(data){
            $scope.confirmed = true;
            }),
            function(err){
              $scope.addEventError = "Looks like something went wrong! Please try again"
        }
      // }

    }




  });
