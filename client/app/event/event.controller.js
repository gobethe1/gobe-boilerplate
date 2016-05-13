'use strict';

angular.module('gobeApp')
  .controller('EventCtrl', ['$scope', '$state', '$stateParams', 'Event', 'eventModel',
    'currentUser', 'Auth', 'Path', '$uibModal',
    function ($scope, $state, $stateParams, Event, eventModel, currentUser, Auth, Path, $uibModal) {
    // console.log(currentUser)
  	$scope.listEvents             = eventModel;
    $scope.hover                  = true;
    $scope.newEvent               = {};
    $scope.newEvent.availability  = {};
    $scope.newEvent.address       = {};
    $scope.isAdmin                = Auth.isAdmin;
    $scope.activeSubscription     = Auth.activeSubscription;
    $scope.path                   = Path.transitionToPath;
    $scope.showLink               = 'event.show';
    $scope.groupCauseArray        = ["Homeless Move-in", "Other"];
    $scope.causeArray             = ["Other"];

    // event list sorting filters
    $scope.sort = {};
    $scope.all = {};
    $scope.matched = {'confirmGroup': "!!", 'published': true };
    $scope.pending =  {'published': true, 'confirmGroup': null };
    $scope.unpublished = {'published': false, 'confirmGroup': null };

    $scope.newEvent.availability.firstDateTime  = [false, false, false];
    $scope.newEvent.availability.secondDateTime = [false, false, false];
    $scope.newEvent.availability.thirdDateTime  = [false, false, false];
    $scope.newEvent.userId                      = currentUser._id;

    // check user id fx
    $scope.checkEventFilter = function(event){
      if($scope.isAdmin()){
        return {};
      }
      else {
        return event.userId === currentUser._id;
      }
    };

    var checkAddress = function(){
        $scope.newEvent.address   = $scope.newEvent.address.formatted_address;
        var fullAddress           = $scope.newEvent.address;
        var addressArray          = fullAddress.split(',');
        var stateAndZip           = addressArray[addressArray.length - 2].split(' ');
        var zip                   = stateAndZip[2];
        $scope.newEvent.zipCode   = zip;
    };

    // payment modal
    $scope.openPaymentModal = function() {
    var modalInstance = $uibModal.open({
        templateUrl: 'components/modal/stripe.html',
        controller: 'ModalCtrl',
        resolve: {
          currentUser: ['Auth', function(Auth){
             return Auth.getCurrentUser().$promise;
          }]
        }
      });
    };

    $scope.confirmGroupStatus = function(event){
      if(!event.confirmGroup){
        return false;
      }
      else if(event.confirmGroup){
        return true;
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
    };

    $scope.addEvent = function addEvent(){
      $scope.newEvent.published = false;
      $scope.submitted = false;
      checkAddress();

      Event.save($scope.newEvent, function(data){
        $state.go('event.list');
      }),
      function(err){
        $scope.addEventError = "Looks like something went wrong! Please try again"
      }
    };

    $scope.publishEvent = function publishEvent(form) {

        $scope.newEvent.published = true;
        $scope.submitted          = true;
        checkAddress();

           if(form.$valid){
               Event.send($scope.newEvent,
                 function(data){
                    $state.go('event.list')
                   }),
                   function(err){
                   	$scope.publishEventError = "Looks like something went wrong! Please try again"
                   }
                 }
           else{
               document.body.scrollTop = document.documentElement.scrollTop = 0;
           }
    };


    $scope.deleteEvent = function deleteEvent(id){
      if(confirm('Are you sure you want to delete this client?')){
        angular.forEach($scope.listEvents, function(e, i) {
           if (e._id === id) {
             $scope.listEvents.splice(i, 1);
           }
         });

        Event.remove({id: id });
      };
    }

    $scope.createLabel = function(eventName, label){
        if(eventName === 'Homeless Move-in' && (label === 'Zipcode' || label === 'Date' || label === 'address')){
          return 'Move-in'
        }
        else if(label === 'Notes' ){
          if(eventName === 'Homeless Move-in'){
            return  "Notes (optional)"
          }
          else{
            return "Event Description"
          }
        }
        else if(eventName === 'Homeless Move-in'){
            return 'Client';
        }
        else{
          return 'Event';
        }
    }

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.inlineOptions = {
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.open3 = function() {
    $scope.popup3.opened = true;
  };

  $scope.open4 = function() {
    $scope.popup4.opened = true;
  };


  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['MM/dd/yyyy'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  $scope.popup3 = {
    opened: false
  };

  $scope.popup4 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);


}]);
