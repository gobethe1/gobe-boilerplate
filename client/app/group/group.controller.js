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
    $scope.zipCodeSlider = {
      value: 5,
      options: {
        floor: 5,
        ceil: 50,
        showSelectionBar: true,
        translate: function(value) {
           return value + ' mi';
         }
      }
    };

    // dropdown-button
    $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };

    var checkAddress = function(){
        $scope.newGroup.address   = $scope.newGroup.address.formatted_address;
        var fullAddress           = $scope.newGroup.address;
        var addressArray          = fullAddress.split(',');
        var stateAndZip           = addressArray[addressArray.length - 2].split(' ');
        var zip                   = stateAndZip[2];
        $scope.newGroup.zipCode   = zip;
    };


    var zipCodeApiKey = "js-WcPJ12XU5oJLwX3Y0aENthT6mWnK3Ol00bJ1dGVj5F4CC8ACifqMwkSShfDk3Yk4";
    var newArr = [];

    $scope.addGroup = function addGroup(form) {
        $scope.newGroup = $scope.newGroup;
        $scope.newGroup.matchRadius = $scope.zipCodeSlider.value;
        $scope.newGroup.previousEmailList = $scope.newGroup.emailList;
        $scope.submitted = true;
        checkAddress();
           if(form.$valid){
              $http({  method: "GET",
                      url: 'https://www.zipcodeapi.com/rest/' + zipCodeApiKey + '/radius.json/' + $scope.newGroup.zipCode + '/' + $scope.newGroup.matchRadius + '/mile',
                      headers: {Authorization: undefined}
                     }).then
                        (function(response){
                            // console.log(response.data)
                            var data = response.data;
                            data.zip_codes.map(function(value){
                            newArr.push(value.zip_code);
                          })
                            // console.log("newArr")
                            // console.log(newArr)
                            $scope.newGroup.matchZipCodeArr = newArr;

                        }).then(function(){
                            Group.save($scope.newGroup,
                              function(data){
                                 $scope.currentUser.groupId = data._id
                                 $state.go('group.show', {id: data._id})
                                }),
                                function(err){
                                 $scope.addGroupError = "Looks like something went wrong! Please try again"
                                }
                        })

               }
         else{
             document.body.scrollTop = document.documentElement.scrollTop = 0;
         }
    };


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

    $scope.alerts = [
      { type: 'warning', msg: 'Email has been added to the group. When you choose an event to attend they will now automatically be invited.' },
    ];

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
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
