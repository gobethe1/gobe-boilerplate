'use strict';

angular.module('gobeApp')
    .controller('ModalCtrl', [ '$scope', '$state', 'User', 'currentUser', '$uibModalInstance',
        function controller($scope, $state, User, currentUser, $uibModalInstance) {

    $scope.submitted = false;
    $scope.promo;
    $scope.currentUser = currentUser;
    $scope.cardErrorMessage = null;

    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };

    $scope.stripeCallback = function (code, result) {
        $scope.submitted = true;
        $scope.cardErrorMessage = null;

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
