'use strict';

angular.module('gobeApp')
  .controller('ModalCtrl', function ($scope, Modal, User) {
    $scope.submitted = false;

    $scope.stripeCallback = function (code, result) {
        $scope.submitted = true;
        console.log($scope.checkoutForm)
        console.log("firing stripe callback")
        console.log(result)
        User.createSubscription({token: result.id})
        if (result.error) {
            window.alert('it failed! error: ' + result.error.message);
        } else {
            window.alert('success! token: ' + result.id);
        }
    };

})
