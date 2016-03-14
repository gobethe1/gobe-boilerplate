'use strict';

angular.module('gobeApp')
  .config(function ($stateProvider) {
    $stateProvider

	 .state('confirm', {
	  url: '/confirm/:event_id/:group_id',
	  templateUrl: 'app/confirm/confirm.html',
	  controller: 'ConfirmCtrl',
	  resolve:{
	   eventConfirm: function(Event, $stateParams){
	     return Event.get({id: $stateParams.event_id}).$promise;
	   }
	  }
	})
      
  .state('confirm.group', {
    url: '/confirm/:event_id/:group_id',
    templateUrl: 'app/confirm/confirm-event.html',
    controller: 'ConfirmEventCtrl'
  });


  });