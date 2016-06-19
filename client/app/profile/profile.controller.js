'use strict';

angular.module('gobeApp')
  .controller('ProfileCtrl', function ($scope, $filter, User, currentUser, eventModel, Auth, Path, customerInfo, $state, $http) {
    $scope.user          = currentUser;
    $scope.events        = eventModel;
    var events           = eventModel;
    $scope.matchedZips   = []; // for check for matches fx
    $scope.matchedEvents = [];
    $scope.isAdmin       = Auth.isAdmin;
    $scope.path          = Path.transitionToPath;
    $scope.returnValue   = [$scope.matchedZips, $scope.matchedEvents];
    $scope.userName      = ($scope.user.firstName + ' ' + $scope.user.lastName) || "NA";
    $scope.phoneNumber   = $scope.user.phoneNumber || "NA";
    $scope.photo         = $scope.user.photo;
    console.log($scope.user.photo)
    var user             = currentUser;



    // console.log('this is linked!')

// list available vs your causes tab
    $scope.tab = 0;

    $scope.changeTab = function(newTab){
      $scope.tab = newTab;
    };

    $scope.isActiveTab = function(tab){
      return $scope.tab === tab;
    };
// end list available vs your causes tab

// before loading page check to see if address is set

// or undefined to prevent controller error
    var checkProfile = function(){
        if($scope.user.address !== undefined) {
            var splitAddress = ($scope.user.address.split(','));
            $scope.shortAddress = splitAddress[0] + ', ' + splitAddress[1];
        }
    }
    checkProfile();
// end profile check for address


// check for zip code matches
    var checkForMatches = function(events){

        eventModel.forEach(function(event){
          var eventMatched = event.confirmIndividuals.indexOf(user._id) !== -1;
          var zipMatched   = user.matchZipCodeArr.indexOf(event.zipCode) !== -1;
          var baseRequirement = event.published && !event.groupOnly;

          if(baseRequirement && eventMatched && zipMatched) {
            // console.log('matched: ', event)
            $scope.matchedEvents.push(event);
          }
          else if(baseRequirement && zipMatched && !eventMatched){
            // console.log('true: ', event)
            $scope.matchedZips.push(event);
          }
          else {
            // console.log('failed')
            return null;
          }

        })

        // return $scope.returnValue;

    };
    checkForMatches(events)


// end check for zip code matches

// fx to shorten address in profile details view
    $scope.shortAddress = function(address){
      if(user.address != null){
       var shortAddress = user.address.split(',')
       return shortAddress[0] + ", " + shortAddress[1];
      }
      else return '';
    }

    $scope.callAddress = $scope.shortAddress();
// end fx to shorten address in profile details view


     $scope.currentUser = currentUser;
     $scope.currentUser.address;
     var value = $scope.currentUser.matchRadius || 5;

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



    // console.log($scope.user.address)
    var customerInfo = customerInfo;

    if(customerInfo){
    	var trialEnd = new Date(customerInfo.trial_end * 1000);
    	var currentPeriodEnd = new Date(customerInfo.current_period_end * 1000);
	}

    $scope.checkStatus = function(){
      if(customerInfo){
	      if(customerInfo.status === "trialing"){
	      	return "Free Trial";
	      }
	      else if(customerInfo.status === "active"){
	      	return "Active";
	      }
	      else{
	      	return "Inactive";
	      }
  	  }
  	  else{
  	  	return "None";
  	  }
    }

    $scope.checkRenewal = function(){
    	if(customerInfo){
    		if(customerInfo.status === "trialing"){
    			var endDate = moment(trialEnd);
    			var remainingDays = endDate.diff(Date.now(), "days");
    			return remainingDays + " days remaining on free trial"
    		}
    		else if(customerInfo.status === "active"){
    			return "Renews on "	+ $filter('date')(currentPeriodEnd, "MM-dd-yyyy");
    		}
    		else{
    		   return "Inactive";
    		}
    	}
    	else{
    	  return "None";
    	}
    }

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
                            // console.log(response.data)
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
