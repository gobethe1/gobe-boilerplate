'use strict';

angular.module('gobeApp')
  .controller('ModalCtrl', function ($scope, Modal) {

    $scope.stripeCallback = function (code, result) {
      console.log($scope.checkoutForm)
        console.log("firing stripe callback")
        console.log(code)
        console.log(result)
        if (result.error) {
            window.alert('it failed! error: ' + result.error.message);
        } else {
            window.alert('success! token: ' + result.id);
        }
    };

})