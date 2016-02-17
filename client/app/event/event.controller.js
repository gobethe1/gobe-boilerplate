'use strict';

angular.module('gobeApp')
  .controller('EventCtrl', function ($scope) {
    $scope.message = 'Hello';

    // $scope.firstDateTime = {
    //   morning: false,
    //   afternoon: false,
    //   evening: false,
    // }



    $scope.firstDateTime = [false, false, false];
    $scope.secondDateTime = [false, false, false];
    $scope.thirdDateTime = [false, false, false];

  });
