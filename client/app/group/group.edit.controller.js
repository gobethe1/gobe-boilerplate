'use strict';

angular.module('gobeApp')
  .controller('GroupEditCtrl', function ($scope, $state, $http, $stateParams, Group, groupEdit, groupPreviousEmail, currentProfile) {
    $scope.newGroup = groupEdit;
    $scope.oldGroup = groupPreviousEmail;
    $scope.emailList = $scope.newGroup.emailList;
    $scope.previousEmailList = $scope.oldGroup.emailList;
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

    var checkAddress = function(){
        $scope.newGroup.address   = $scope.newGroup.address.formatted_address || $scope.newGroup.address;
        var fullAddress           = $scope.newGroup.address;
        var addressArray          = fullAddress.split(',');
        var stateAndZip           = addressArray[addressArray.length - 2].split(' ');
        var zip                   = stateAndZip[2];
        $scope.newGroup.zipCode   = zip;
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

    var zipCodeApiKey = "js-WcPJ12XU5oJLwX3Y0aENthT6mWnK3Ol00bJ1dGVj5F4CC8ACifqMwkSShfDk3Yk4";
    var newArr = [];

    $scope.updateGroup = function addGroup(form) {
      $scope.newGroup.matchRadius = $scope.zipCodeSlider.value;
      $scope.newGroup.previousEmailList = $scope.previousEmailList;
      var data = $scope.newGroup;
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
                          Group.update({id: $stateParams.id }, data,
                            function(data){
                              if(currentProfile.groupId === $scope.newGroup._id){
                                  $state.go('group.show', {id: data._id});
                                }
                                else {
                                  $state.go('group.list');
                                }
                               }),
                               // $scope.currentUser.groupId = data._id
                               // $state.go('group.show', {id: data._id})
                            function(err){
                             $scope.addEventError = "Looks like something went wrong! Please try again"
                            }
                      })

                  }
          else{
           document.body.scrollTop = document.documentElement.scrollTop = 0;
          }
    };

        //  if(form.$valid){
        //      Group.update({id: $stateParams.id }, data,
        //        function(data){
        //         if(currentProfile.groupId === $scope.newGroup._id){
        //             $state.go('group.show', {id: data._id});
        //           }
        //           else {
        //             $state.go('group.list');
        //           }
        //          }),
        //          function(err){
        //           $scope.addEventError = "Looks like something went wrong! Please try again";
        //          }
        //        }
        //  else{
        //      document.body.scrollTop = document.documentElement.scrollTop = 0;
        //  }
        // };

  });
