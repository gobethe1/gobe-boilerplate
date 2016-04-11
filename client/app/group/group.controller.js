'use strict';

angular.module('gobeApp')
  .controller('GroupCtrl', [ '$scope', '$http', '$state', 'Group', 'groupModel', '$stateParams', 'currentUser', 'Auth', '$uibModal',
    function ($scope, $http, $state, Group, groupModel, $stateParams, currentUser, Auth, $uibModal) {

    $scope.listGroups = groupModel;
    $scope.newGroup = {};
    $scope.newGroup.emailList = [];
    $scope.emailList = $scope.newGroup.emailList;
    $scope.hover = true;
    $scope.currentUser = currentUser;
    $scope.newGroup.ownedBy = currentUser._id;
    $scope.newGroup.email   = currentUser.email;
    $scope.isAdmin = Auth.isAdmin();
    $scope.priceSlider = {
      value: 5,
      options: {
        floor: 5,
        ceil: 50,
        showSelectionBar: true,
        translate: function(value) {
           return value + ' mi';
         }
      }
    }


    var zipCodeApiKey = "js-WcPJ12XU5oJLwX3Y0aENthT6mWnK3Ol00bJ1dGVj5F4CC8ACifqMwkSShfDk3Yk4";
    $scope.newGroup.zipCode = '90036';
    $scope.newGroup.matchRadius = '5';

    // $.ajax('https://www.zipcodeapi.com/rest/js-WcPJ12XU5oJLwX3Y0aENthT6mWnK3Ol00bJ1dGVj5F4CC8ACifqMwkSShfDk3Yk4/radius.json/90028/5/mile')
    //https://www.zipcodeapi.com/rest/<api_key>/radius.<format>/<zip_code>/<distance>/<units>
    //https://www.zipcodeapi.com/rest/md9rylFy2kijKcS804V7xxMKHHOePVDb8NCG9ifbCxvmKovLsqT0XFKEnyTcuwoC/radius.json/90036/5/mile
    // $http({
    //       origin: "http://localhost:9000",
    //       method: "GET",
    //       url: 'https://www.zipcodeapi.com/rest/' + zipCodeApiKey + '/radius.json/' + $scope.newGroup.zipCode + '/' +
    //            $scope.newGroup.matchRadius + '/mile',
    //       headers: {'Access-Control-Allow-Headers': "*"}
    //        })
    //             .success(function(data){
    //                 console.log(data)
    //             })
    // $.ajax('https://www.zipcodeapi.com/rest/js-WcPJ12XU5oJLwX3Y0aENthT6mWnK3Ol00bJ1dGVj5F4CC8ACifqMwkSShfDk3Yk4/5.radius.json/90028/mile')

    // $scope.openPaymentModal = Modal.confirm.payment();

    $scope.openPaymentModal = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'components/modal/stripe.html',
            controller: 'ModalCtrl',
            resolve: {
              currentUser: ['Auth', function(Auth){
                 return Auth.getCurrentUser().$promise;
              }]
            }
          });
        }

    if(!$scope.isAdmin){
    $scope.groupUserFilter = {'ownedBy': currentUser._id}
    }


    $scope.cancelGroup = function cancelGroup(){
      if(confirm("Are you sure you want to cancel? All changes will be lost.")){
        $state.go('group.list');
      }
    }

    $scope.addEmail = function addEmail(){
      $scope.newGroup.emailList.push($scope.email);
      $scope.email = null;
    };

    $scope.addGroup = function addGroup(form) {
      $scope.newGroup = $scope.newGroup
      $scope.submitted = true;
         if(form.$valid){
             Group.save($scope.newGroup,
               function(data){
                  $state.go('group.confirmation',
                    {confirm: data._id})
                 }),
                 function(err){
                  $scope.addGroupError = "Looks like something went wrong! Please try again"
                 }
               }
         else{
             document.body.scrollTop = document.documentElement.scrollTop = 0;
         }
    };

    $scope.deleteGroup = function deleteGroup(id){
      if(confirm('Are you sure you want to delete this client?')){
        angular.forEach($scope.listGroups, function(e, i) {
           if (e._id === id) {
             $scope.listGroups.splice(i, 1);
           }
         });

        Group.remove({id: id });
      };
    }


  }])


  .controller('GroupConfirmCtrl', function ($scope, $state, $stateParams, groupModel, groupShow, $location) {

    $scope.group = groupShow;
    $scope.confirm = $location.path().indexOf('/group/confirmation') > -1 ? true : false;

  });
