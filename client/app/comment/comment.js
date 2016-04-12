'use strict';

angular.module('gobeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('comment', {
        url: '/comment',
        templateUrl: 'app/comment/comment.html',
        controller: 'CommentCtrl'
      });
  });