'use strict';

angular.module('gobeApp')
  .controller('GroupCtrl', function ($scope, $state, Group, groupModel, $stateParams, currentUser, Auth, Modal) {
    $scope.listGroups = groupModel;
    $scope.newGroup = {};
    $scope.newGroup.emailList = [];
    $scope.emailList = $scope.newGroup.emailList;
    $scope.hover = true;
    $scope.newGroup.ownedBy = currentUser._id;
    $scope.newGroup.email   = currentUser.email;
    var isAdmin = Auth.isAdmin();
    console.log("!isAdmin")
    console.log(!isAdmin)

    $scope.openTest = Modal.confirm.payment();

    // $scope.stripeCallback = function (code, result) {
    //     console.log("firing callback")
    //     console.log(code)
    //     console.log(result)
    //     if (result.error) {
    //         window.alert('it failed! error: ' + result.error.message);
    //     } else {
    //         window.alert('success! token: ' + result.id);
    //     }
    // };

    if(!isAdmin){
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
  })


  .controller('GroupConfirmCtrl', function ($scope, $state, $stateParams, groupModel, groupShow, $location) {

    $scope.group = groupShow;
    $scope.confirm = $location.path().indexOf('/group/confirmation') > -1 ? true : false;

  });
