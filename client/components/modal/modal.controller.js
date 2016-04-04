'use strict';

angular.module('gobeApp')
  .controller('ModalCtrl', function ($scope, Modal, User, currentUser, $state, $uibModalStack) {
    $scope.submitted = false;
    $scope.promo;
    $scope.currentUser = currentUser;

    $scope.stripeCallback = function (code, result) {
        $scope.submitted = true;
        $scope.cardErrorMessage = null;

        // console.log($scope.checkoutForm)
        // console.log("firing stripe callback")
        console.log(result)

        // if (result.error) {
        //     window.alert('it failed! error: ' + result.error.message);
        // } else {
        //     window.alert('success! token: ' + result.id);
        // }

        if(result.error) {
           $scope.cardErrorMessage = result.error.message;
        }
        else{
        User.createSubscription({token: result.id, user_id: currentUser._id, email: currentUser.email, promo: $scope.promo},
            function(data){
                console.log(data)
                $scope.currentUser.activeSubscription = true;
                // console.log("close")
                // $uibModalStack.dismissAll();
                $state.go('group.new');
              }),
              function(err){
                console.log(err)
              }
        }

    };

})
