'use strict';

angular.module('gobeApp')
  .controller('ConfirmIndividualCtrl', function ($scope, $state, $stateParams, Event, eventConfirm) {
    $scope.event = eventConfirm;
    console.log('state: ', $stateParams.user_id)
    console.log('event: ', $stateParams.event_id)
    console.log('scope event: ', $scope.event)

    var confirmIndividualTime = function(){
      $scope.submitted = true;
      $scope.individual = $stateParams.user_id;
      $scope.confirmIndividuals  = $scope.event.confirmIndividuals.push($scope.individual)

      Event.update({id: $stateParams.event_id },
        function(data){
          $scope.confirmed = true;
          }),
          function(err){
            $scope.addEventError = "Looks like something went wrong! Please try again"
      }

    }




  });
