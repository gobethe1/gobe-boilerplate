'use strict';

angular.module('gobeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('comment', {
        url: '/comment',
        templateUrl: 'app/comment/comment.html',
        controller: 'CommentCtrl',
        resolve:{
         currentUser: function(Auth){
            return Auth.getCurrentUser().$promise;
         },
         commentModel: function(Comment){
           return Comment.query().$promise;
         }
        }
      });
  });