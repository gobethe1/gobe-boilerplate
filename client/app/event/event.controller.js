'use strict';

angular.module('gobeApp')
  .controller('EventCtrl', function ($scope, Event) {
    $scope.message = 'Hello';
    $scope.newEvent = {};
    console.log($scope.newEvent);
    $scope.firstDateTime = [false, false, false];
    $scope.secondDateTime = [false, false, false];
    $scope.thirdDateTime = [false, false, false];

    $scope.addEvent = function addEvent(form) {
      $scope.submitted = true;
          console.log(form)
          console.log($scope.newEvent)
         if(form.$valid){
             Event.save($scope.newEvent,
               function(data){
                  console.log('we did it!');
                  console.log(data);
                 }),
                 function(err){
                  console.log('nah');
                  console.log(data);
                 }
               }
         else{
             document.body.scrollTop = document.documentElement.scrollTop = 0;
         }
    };

  });
