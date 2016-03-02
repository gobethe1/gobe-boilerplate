angular.module('gobeApp')
  .controller('GroupShowCtrl', function ($scope, $stateParams, Group, groupShow) {

    $scope.group = groupShow;
    $scope.emailList = $scope.group.emailList;

   // console.log($scope.group)
   console.log(group.emailList)


  });
