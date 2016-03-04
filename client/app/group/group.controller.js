'use strict';

angular.module('gobeApp')
  .controller('GroupCtrl', function ($scope, $state, Group, groupModel, $stateParams) {
    $scope.listGroups = groupModel;
    $scope.newGroup = {};
    $scope.newGroup.emailList = [];
    $scope.emailList = $scope.newGroup.emailList;
    $scope.hover = true;

    $scope.cancelGroup = function cancelGroup(){
      if(confirm("Are you sure you want to cancel this new group?")){
        $state.go('group.list');
      }
    }

    $scope.addEmail = function addEmail(){
      $scope.newGroup.emailList.push($scope.email);
      console.log('emailList');
      console.log($scope.newGroup.emailList);
      $scope.email = null;
    };

    $scope.addGroup = function addGroup(form) {
      console.log(form)
      console.log("newGroup")
      console.log($scope.newGroup)
      $scope.newGroup = $scope.newGroup
      console.log("stateParams")
      console.log($stateParams)


      $scope.submitted = true;
         if(form.$valid){
             Group.send($scope.newGroup,
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
          console.log('e')
          console.log(e)
           if (e._id === id) {
             $scope.listGroups.splice(i, 1);
           }
         });

        Group.remove({id: id });
      };
    }
  })


  .controller('GroupConfirmCtrl', function ($scope, $state, $stateParams, groupModel, groupShow, $location) {
    console.log("GroupConfirmCtrl")
    console.log(groupShow);

    $scope.group = groupShow;

    $scope.confirm = $location.path().indexOf('/group/confirmation') > -1 ? true : false;
    console.log($scope.confirm)
    console.log($stateParams)
     //  console.log($stateParams.confirm)
     // $scope.confirm = $stateParams.confirm;
     // Group.get({id: $stateParams.confirm[0])

     // console.log($scope.confirmValues[6].split(","))
     // $scope.confirmEmails = $scope.confirmValues[6].split(",");
  });
