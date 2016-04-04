'use strict';

angular.module('gobeApp')
  .controller('ModalCtrl', function ($scope, Modal, User, currentUser) {
    $scope.submitted = false;

    $scope.stripeCallback = function (code, result) {
        $scope.submitted = true;
        console.log($scope.checkoutForm)
        console.log("firing stripe callback")
        console.log(result)
        if (result.error) {
            window.alert('it failed! error: ' + result.error.message);
        } else {
            window.alert('success! token: ' + result.id);
        }

        User.createSubscription({token: result.id, user_id: currentUser._id, email: currentUser.email},
            function(data){
                console.log(data)
              }),
              function(err){
                console.log(err)
              }
        
    };

})
