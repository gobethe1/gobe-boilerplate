'use strict';

angular.module('gobeApp')
  .controller('EventCtrl', function ($scope, $state, $stateParams, Event, eventModel, currentUser, Auth) {
    // console.log(currentUser)
  	$scope.listEvents = eventModel;
    $scope.hover = true;
    $scope.newEvent = {};
    $scope.newEvent.availability = {};
    $scope.isAdmin = Auth.isAdmin;

    $scope.sort = {};
    $scope.all = {};
    $scope.matched = {'confirmGroup': "!!"};
    $scope.pending =  {'published': true};
    $scope.unpublished = {'published': false};

    $scope.newEvent.availability.firstDateTime = [false, false, false];
    $scope.newEvent.availability.secondDateTime = [false, false, false];
    $scope.newEvent.availability.thirdDateTime = [false, false, false];
    $scope.newEvent.userId = currentUser._id;

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
      console.log('new event published');
      console.log($scope.newEvent.published)
      Event.save($scope.newEvent, function(data){
        $state.go('event.list');
      }),
      function(err){
        $scope.addEventError = "Looks like something went wrong! Please try again"
      }
    };

    $scope.publishEvent = function publishEvent(form) {
      console.log(form)
        console.log('published')
        $scope.newEvent.published = true;
        $scope.submitted = true;
        console.log($scope.newEvent.published);
           if(form.$valid){
               Event.send($scope.newEvent,
                 function(data){
                    // console.log(data)
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
          console.log('e')
          // console.log(e)
           if (e._id === id) {
             $scope.listEvents.splice(i, 1);
           }
         });

        Event.remove({id: id });
      };
    }

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.inlineOptions = {
    // customClass: getDayClass,
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

  // $scope.events = [
  //   {
  //     date: tomorrow,
  //     status: 'full'
  //   },
  //   {
  //     date: afterTomorrow,
  //     status: 'partially'
  //   }
  // ];

  // function getDayClass(data) {
  //   var date = data.date,
  //     mode = data.mode;
  //   if (mode === 'day') {
  //     var dayToCheck = new Date(date).setHours(0,0,0,0);

  //     for (var i = 0; i < $scope.events.length; i++) {
  //       var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

  //       if (dayToCheck === currentDay) {
  //         return $scope.events[i].status;
  //       }
  //     }
  //   }

  //   return '';
  // }

});
