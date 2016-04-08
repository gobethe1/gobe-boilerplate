'use strict';

angular.module('gobeApp')
    .controller('ModalCtrl', [ '$scope', '$state', 'User', 'currentUser', '$uibModalInstance',
        function controller($scope, $state, User, currentUser, $uibModalInstance) {

    $scope.submitted = false;
    $scope.promo;
    $scope.currentUser = currentUser;
    $scope.cardErrorMessage = null;
    // $scope.checkoutForm;

    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };

    console.log($scope.checkoutForm)

    console.log('stripe callback outside submit: ', $scope.stripeCallback)
        

        $scope.stripeCallback = function (code, result) {
            $scope.submitted = true;
            $scope.cardErrorMessage = null;

            console.log('scope checkout: ', $scope.checkoutForm)
            if(!result.error) {
               User.createSubscription({token: result.id, user_id: currentUser._id, email: currentUser.email, promo: $scope.promo},
                function(data){
                    if(data.status === 'success'){
                      $scope.currentUser.activeSubscription = true;
                      $state.go('group.new');
                    }
                    else if(data.status === 'error'){
                       $scope.cardErrorMessage = data.error.message;
                    }
                  }),
                  function(err){
                    console.log("err")
                    console.log(err)
                  }
            }

        };


}])
