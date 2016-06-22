'use strict';

angular.module('gobeApp')
  .controller('VolunteerCtrl', function ($scope, currentUser, $timeout, Upload, $window, User, $stateParams, $http, $state, $location) {
     $scope.currentUser = currentUser;
     $scope.photo       = $scope.currentUser.photo;
     $scope.currentUser.address;
     var value = $scope.currentUser.matchRadius || 5;
     var s3Link = 'https://s3-us-west-1.amazonaws.com/gobe-test-photos/'

    // photo upload
    $scope.upload = function (dataUrl, name) {
      // console.log('name: ', name)
      var splitName = name.split('.');
      var fileExtension = splitName[splitName.length - 1];
      var name = $scope.currentUser._id + '.' + Date.now() + '.' + fileExtension;
      // console.log('name after: ', name)
      $scope.url = s3Link + name;
        Upload.upload({
            url: 'api/users/uploads',
            data: {
                file: Upload.dataUrltoBlob(dataUrl, name)
              }
        }).then(function (response) {
            $timeout(function () {
                $scope.result = response.data;
            });
        }, function (response) {
            if (response.status > 0) $scope.errorMsg = response.status
                + ': ' + response.data;
        }, function (evt) {
            $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
        });

      $timeout(function() {
        $scope.$emit($scope.currentUser.photo = $scope.url)
        $state.go('profile.details');
      }, 1000);
    }
    // end photo upload


    // list available vs your causes tab
    $scope.tab = 0;

    $scope.changeTab = function(newTab){
      $scope.tab = newTab;
    };

    $scope.isActiveTab = function(tab){
      return $scope.tab === tab;
    };

      // check if user just logged in or merely editing
        $scope.showNewUserFlow = true;
        var checkEditProfilePath = function(){
          if($location.path() === '/profile/edit') {
            $scope.tab = 1;
            return $scope.showNewUserFlow = false;
          }
          else{
            $scope.tab = 0;
            return $scope.showNewUserFlow = true;
          }
        }
        checkEditProfilePath()
      // end user check
    // end list available vs your causes tab

    // zip code radius logic
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

    // end zip code radius logic


    $scope.updateUser = function updateUser(form) {
        checkAddress();
        $scope.currentUser.photo = $scope.url;
        $scope.currentUser = $scope.currentUser;
        $scope.currentUser.matchRadius = $scope.zipCodeSlider.value;
        $scope.submitted = true;
        console.log('matchRadius: ', $scope.currentUser.matchRadius)

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
                                $state.go('volunteer.photo')
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
