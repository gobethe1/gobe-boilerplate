'use strict';

angular.module('gobeApp')
    .controller('ModalCtrl', [ '$scope', '$state', 'User', 'currentUser', '$uibModalInstance',
        function controller($scope, $state, User, currentUser, $uibModalInstance) {
    console.log('state current: ', $state.current)
    console.log('state $current: ', $state.$current)

    $scope.submitted = false;
    $scope.promo;
    $scope.currentUser = currentUser;
    $scope.cardErrorMessage = null;
    $scope.checkoutForm;

    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };


        $scope.stripeCallback = function (code, result) {
            $scope.submitted = true;
            $scope.cardErrorMessage = null;

            if(!result.error) {
              console.log('scope checkout: ', $scope.checkoutForm)
               User.createSubscription({token: result.id, user_id: currentUser._id, email: currentUser.email, promo: $scope.promo},
                function(data){
                    if(data.status === 'success'){
                      if($state.current.name === 'event.list'){
                        $scope.currentUser.activeSubscription = true;
                        $state.go('event.new');
                      } else {
                        $scope.currentUser.activeSubscription = true;
                        $state.go('group.new');
                      }
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
