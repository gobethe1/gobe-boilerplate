'use strict';

angular.module('gobeApp')
  .controller('VolunteerCtrl', function ($scope, currentUser, $timeout, Upload, $window, User, $stateParams, $http, $state) {
     $scope.currentUser = currentUser;
     $scope.currentUser.address;
     var value = $scope.currentUser.matchRadius || 5;
     var s3Link = 'https://s3-us-west-1.amazonaws.com/gobe-test-photos/'



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
        $state.go('profile.details')

    }
    // end upload photo fx
    // upload photo fx
      // $scope.upload = function (file) {
      //   var fileName = new Date();

      //   $scope.url = s3Link + file.name;
      //   console.log('file: ', file)
      //     file.upload = Upload.upload({
      //         arrayKey: '', // default is '[i]'
      //         url: 'api/users/uploads',
      //         data: {file: file}
      //     }).then(function (resp) {
      //         console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
      //     }, function (resp) {
      //         console.log('Error status: ' + resp.status);
      //     }, function (evt) {
      //         var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      //         console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      //     });
      // };
    // end upload photo fx


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

      console.log($scope.zipCodeSlider.value)

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
