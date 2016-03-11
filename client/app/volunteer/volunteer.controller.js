'use strict';

angular.module('gobeApp')
  .controller('VolunteerCtrl', function ($scope, currentUser) {
     $scope.currentUser = currentUser;
  });
