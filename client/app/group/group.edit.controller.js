'use strict';

angular.module('gobeApp')
  .controller('GroupEditCtrl', function ($scope, $state, $stateParams, Group, groupEdit, currentProfile) {
    $scope.newGroup = groupEdit;
    $scope.emailList = $scope.newGroup.emailList;
    $scope.hover = true;
    $scope.zipCodeSlider = {
      value: $scope.newGroup.matchRadius,
      options: {
        floor: 5,
        ceil: 50,
        showSelectionBar: true,
        translate: function(value) {
           return value + ' mi';
         }
      }
    };

    $scope.updateEmail = function updateEmail(){
      $scope.emailList.push($scope.email);
      $scope.email = null;
    };

    $scope.deleteEmail = function deleteEmail(email){
     if(confirm('Are you sure you want to delete this email?')){
        var email = $scope.emailList.indexOf(email);
          $scope.emailList.splice(email, 1);
          $scope.newGroup.emailList = $scope.emailList;
      };
    };

    $scope.cancelGroup = function cancelGroup(){
      if(confirm("Are you sure you want to cancel? All changes will be lost.")){
        $state.go('group.list');
      }
    }


    $scope.updateGroup = function addGroup(form) {
      var data = $scope.newGroup;
      $scope.newGroup.matchRadius = $scope.zipCodeSlider.value;

      $scope.submitted = true;
         if(form.$valid){
             Group.update({id: $stateParams.id }, data,
               function(data){
                console.log(currentProfile)
                if(currentProfile.groupId === $scope.newGroup._id){
                    $state.go('group.profile');
                  }
                  else {
                    $state.go('group.list');
                  }
                 }),
                 function(err){
                  $scope.addEventError = "Looks like something went wrong! Please try again";
                 }
               }
         else{
             document.body.scrollTop = document.documentElement.scrollTop = 0;
         }
    };

  });
