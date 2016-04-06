'use strict';

angular.module('gobeApp')
    .controller('ModalCtrl', [ '$scope', '$state', 'User', 'currentUser', '$uibModalInstance',
        function controller($scope, $state, User, currentUser, $uibModalInstance) {
  
  // .controller('ModalCtrl', function ($scope, User, currentUser, $state, $uibModalInstance) {


    console.log("hitting ModalCtrl")
    $scope.submitted = false;
    $scope.promo;
    $scope.currentUser = currentUser;

    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };

    $scope.stripeCallback = function (code, result) {
        $scope.submitted = true;
        $scope.cardErrorMessage = null;

        if(result.error) {
           $scope.cardErrorMessage = result.error.message;
        }
        else{
        User.createSubscription({token: result.id, user_id: currentUser._id, email: currentUser.email, promo: $scope.promo},
            function(data){
                console.log(data)
                $scope.currentUser.activeSubscription = true;
                $state.go('group.new');
              }),
              function(err){
                console.log(err)
              }
        }

    };

}])
