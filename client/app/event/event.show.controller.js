angular.module('gobeApp')
  .controller('EventShowCtrl', function ($scope, $stateParams, Event, eventShow, Group, eventGroup) {
    
    $scope.event = eventShow;

    if(eventGroup){
      $scope.group = eventGroup;
    }

    var timeArray = ["8am-12pm", "12pm-5pm", "5pm-8pm"];

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

    $scope.partyStatus = function(event){
      if(!event.confirmGroup){
        return "Pending"
      }
      else if(event.confirmGroup){
        return "Party On"
      }
    }

  
  });
