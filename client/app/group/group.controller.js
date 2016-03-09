'use strict';

angular.module('gobeApp')
  .controller('GroupCtrl', function ($scope, $state, Group, groupModel, $stateParams, currentUser) {
    $scope.listGroups = groupModel;
    $scope.newGroup = {};
    $scope.newGroup.emailList = [];
    $scope.emailList = $scope.newGroup.emailList;
    $scope.hover = true;
    $scope.newGroup.ownedBy = currentUser._id;
    // $scope.currentUser.groupId = $scope.newGroup.ownedBy;


    $scope.cancelGroup = function cancelGroup(){
      if(confirm("Are you sure you want to cancel this new group?")){
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
