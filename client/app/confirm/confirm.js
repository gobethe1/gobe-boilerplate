'use strict';

angular.module('gobeApp')
  .config(function ($stateProvider) {
    $stateProvider

	 .state('confirm', {
	  url: '/confirm',
	  templateUrl: 'app/confirm/confirm.html',
	  controller: 'ConfirmCtrl'
	})

  .state('confirm.group', {
    url: '/:event_id/:group_id',
    templateUrl: 'app/confirm/confirm-event.html',
    controller: 'ConfirmEventCtrl',
    resolve:{
     eventConfirm: function(Event, $stateParams){
       return Event.get({id: $stateParams.event_id}).$promise;
     }
    }
  })

  .state('confirm.volunteer', {
    url: '/volunteer/:group_id/:event_id/:email/:response',
    templateUrl: 'app/confirm/confirm-volunteer.html',
    controller: 'ConfirmVolunteerCtrl',
    resolve:{
     eventConfirm: function(Event, $stateParams){
       return Event.get({id: $stateParams.event_id}).$promise;
     },
     groupConfirm: function(Group, $stateParams){
      return Group.get({id: $stateParams.group_id}).$promise;
     }
    }
  });



});
