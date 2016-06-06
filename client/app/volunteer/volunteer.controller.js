'use strict';

angular.module('gobeApp')
  .controller('VolunteerCtrl', function ($scope, currentUser, User, $stateParams, $http, $state) {
     $scope.currentUser = currentUser;
     $scope.currentUser.address;
     var value = $scope.currentUser.matchRadius || 5;

    // list available vs your causes tab
    $scope.tab = 0;

    $scope.changeTab = function(newTab){
      // console.log('change tab')
      $scope.tab = newTab;
    };

    $scope.isActiveTab = function(tab){
      // console.log('tab #: ', tab)
      return $scope.tab === tab;
    };
// end list available vs your causes tab

     // console.log('current user address: ', $scope.currentUser.address)
     $scope.zipCodeSlider = {
        value: value,
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
        $scope.currentUser.address    = $scope.currentUser.address.formatted_address || $scope.currentUser.address;
        var fullAddress               = $scope.currentUser.address;
        var addressArray              = fullAddress.split(',');
        var stateAndZip               = addressArray[addressArray.length - 2].split(' ');
        var zip                       = stateAndZip[2];
        $scope.currentUser.zipCode    = zip;
    };

    var zipCodeApiKey = "js-WcPJ12XU5oJLwX3Y0aENthT6mWnK3Ol00bJ1dGVj5F4CC8ACifqMwkSShfDk3Yk4";
    var newArr = [];

    $scope.updateUser = function updateUser(form) {
        checkAddress();
        $scope.currentUser = $scope.currentUser;
        $scope.currentUser.matchRadius = $scope.zipCodeSlider.value;
        $scope.submitted = true;

           if(form.$valid){
              $http({  method: "GET",
                      url: 'https://www.zipcodeapi.com/rest/' + zipCodeApiKey + '/radius.json/' + $scope.currentUser.zipCode + '/' + $scope.currentUser.matchRadius + '/mile',
                      headers: {Authorization: undefined}
                     }).then
                        (function(response){
                            var data = response.data;
                            data.zip_codes.map(function(value){
                            newArr.push(value.zip_code);
                          })
                            // console.log("newArr")
                            // console.log(newArr)
                            $scope.currentUser.matchZipCodeArr = newArr;
                            // console.log('newarr: ', $scope.currentUser.matchZipCodeArr);
                        }).then(function(){
                            User.update($scope.currentUser,
                              function(data){
                                $state.go('profile.details')
                                }),
                                function(err){
                                 $scope.updateUserError = "Looks like something went wrong! Please try again"
                                }
                        })

               }
         else{
             document.body.scrollTop = document.documentElement.scrollTop = 0;
         }
    };

  });
