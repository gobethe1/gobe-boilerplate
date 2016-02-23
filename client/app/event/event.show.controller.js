angular.module('gobeApp')
  .controller('EventShowCtrl', function ($scope, $stateParams, Event) {
    var timeArray = ["8am - 12pm", "12pm - 5pm", "5pm - 8pm"];

    $scope.checkTime = function(time, index) {

        if(time && (index === 0)){
          return timeArray[0];
        }
        else {
          return null
        }
        if(time && (index === 1)){
          return timeArray[1];
        }
        else {
          return null
        }
        if(time && (index === 2)){
          return timeArray[2];
        }
        else {
          return null
        }

    };
    $scope.event = Event.get({id: $stateParams.id});
  });
