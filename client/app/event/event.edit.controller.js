'use strict';

angular.module('gobeApp')
  .controller('EventEditCtrl', function ($scope, $state, $stateParams, Event, eventEdit) {
    $scope.showMeetupAddress = (eventEdit.causeType === 'Homeless Move-in') && eventEdit.confirmGroup;



    $scope.newEvent = eventEdit;

    if ($scope.newEvent.availability.moveInDate){
      $scope.newEvent.availability.moveInDate = new Date($scope.newEvent.availability.moveInDate);
    };

    if($scope.newEvent.availability.firstDate){
      $scope.newEvent.availability.firstDate = new Date($scope.newEvent.availability.firstDate);
    };

    if($scope.newEvent.availability.secondDate){
       $scope.newEvent.availability.secondDate = new Date($scope.newEvent.availability.secondDate);
    };

    if($scope.newEvent.availability.thirdDate){
      $scope.newEvent.availability.thirdDate =  new Date($scope.newEvent.availability.thirdDate);
    };

    //loop through dateTimes array to assign new value from form
    $scope.newEvent.dateTimes.forEach(function(dt){
      if(dt.date){
        dt.date =  new Date(dt.date);
      }
      if(dt.startTime !== ''){
        dt.startTime = dt.startTime;
      }
      if(dt.endTime !== ''){
        dt.endTime = dt.endTime;
      }
    })

    // add date time button fx
    $scope.addDt= function(){
      $scope.newEvent.dateTimes.push({
        date: null,
        startTime: '',
        endTime: ''
      });
    };

    var checkAddress = function(){
        $scope.newEvent.address         = $scope.newEvent.address.formatted_address || $scope.newEvent.address;
        var fullAddress                 = $scope.newEvent.address;
        var addressArray                = fullAddress.split(',');
        var stateAndZip                 = addressArray[addressArray.length - 2].split(' ');
        var zip                         = stateAndZip[2];
        $scope.newEvent.zipCode         = zip;
        // console.log('meetup: ', $scope.newEvent.meetupAddress)
        if($scope.newEvent.meetupAddress){
          $scope.newEvent.meetupAddress   = $scope.newEvent.meetupAddress.formatted_address || $scope.newEvent.meetupAddress;
          var fullMeetupAddress           = $scope.newEvent.meetupAddress;
          var meetupAddressArray          = fullMeetupAddress.split(',');
          var meetupStateAndZip           = meetupAddressArray[meetupAddressArray.length - 2].split(' ');
          var meetupZip                   = meetupStateAndZip[2];
          $scope.newEvent.zipCode         = meetupZip;
        }
    };

    $scope.updateEvent = function updateEvent(form){
      $scope.submitted = false;

      if($scope.newEvent.address !== null){
        checkAddress();
      }

      var data = $scope.newEvent;
      // console.log('new event published');
      // console.log($scope.newEvent.published)
        Event.update({id: $stateParams.id}, data,
           function(data){
              // console.log('data')
              // console.log(data)
                $state.go('event.list')
               }),
           function(err){
            $scope.addEventError = "Looks like something went wrong! Please try again"
           }
    };

    $scope.publishEvent = function publishEvent(form) {
      var data = $scope.newEvent;
      $scope.submitted = true;
      $scope.newEvent.published = true;
      checkAddress();
      // console.log(form)
         if(form.$valid){
             Event.sendupdate({id: $stateParams.id }, data,
               function(data){
                // console.log('data')
                // console.log(data)
                  $state.go('event.list')
                 }),
                 function(err){
                 	$scope.addEventError = "Looks like something went wrong! Please try again"
                 }
               }
         else{
             document.body.scrollTop = document.documentElement.scrollTop = 0;
         }
    };

    $scope.cancelClient = function cancelClient(form){
      if(form.$pristine){
          $state.go('event.list');
        } else {
           if(confirm("Are you sure you want to cancel? All changes will be lost.")){
             $state.go('event.list');
           }
        }
      }



  });
