'use strict'

angular.module('gobeApp')
  .controller('GroupShowCtrl', function ($scope, $stateParams, Group, groupShow, currentUser, eventModel, Auth) {
    $scope.currentUser = currentUser;
  	// console.log("currentUser")
  	// console.log(currentUser)
    $scope.group = groupShow;
    $scope.events = eventModel
    // console.log($scope.events)
    $scope.isAdmin = Auth.isAdmin;
    $scope.activeSubscription =  Auth.activeSubscription;

    console.log('this is linked!')

    //filters
    var groupId                 = groupShow._id;
    $scope.matchedZipCode       =  {'confirmGroup': groupId, 'published': true};
    $scope.matchedArray         = [];
    $scope.acceptedPastArray    = [];
    $scope.acceptedCurrentArray = [];
    $scope.returnValue          = [$scope.matchedArray, $scope.acceptedCurrentArray, $scope.acceptedPastArray];


    var checkMatchedArray = function(events){
        eventModel.forEach(function(event){
        var baseRequirement = event.published && event.groupOnly;

          if (baseRequirement && !event.confirmGroup && groupShow.matchZipCodeArr.indexOf(event.zipCode) !== -1){
             $scope.matchedArray.push(event);
          }

          else if(baseRequirement && (event.confirmGroup === groupId)) {
            // console.log("event confirmDate", event.confirmDate, typeof event.confirmDate)
            // console.log("event confirmDate as Date object", new Date(event.confirmDate))

            var confirmDate = new Date(event.confirmDate);

            // console.log("Date.now", Date.now())
            // console.log("new Date", new Date)
            // console.log("hitting acceptedCurrentArray", event)
            // console.log("confirmDate < new Date", (confirmDate < new Date))

            if(confirmDate < new Date){
                $scope.acceptedPastArray.push(event);
            }
            else if(confirmDate > new Date){
                $scope.acceptedCurrentArray.push(event);
            }

          } else {
            return null;
          }
        })
        return $scope.returnValue;
    };

    $scope.shortAddress = function(address){
       var shortAddress = address.split(',')
       return shortAddress[0] + ", " + shortAddress[1];
    }

    // console.log('return value: ', $scope.returnValue)
    checkMatchedArray();
    // console.log('matchedArray: ', $scope.matchedArray)
    // console.log('acceptedPastArray', $scope.acceptedPastArray)
    // console.log('acceptedCurrentArray', $scope.acceptedCurrentArray)
    // console.log('accepted matched: ', $scope.acceptedMatchedArray)
    // console.log('checkMatchedArray: ', checkMatchedArray())
    // console.log('pastArray: ', $scope.pastArray, 'currentArray: ', $scope.currentArray)
    // console.log('check if passed fx: ', checkIfEventPassed())

  });
