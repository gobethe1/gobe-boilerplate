'use strict';

angular.module('gobeApp')
  .controller('CommentCtrl', function ($scope, $state, Comment, currentUser, commentModel) {

  	$scope.comment = {};
  	$scope.comments = commentModel;
  	$scope.user = currentUser;
  	$scope.comment.email = currentUser.email;

  
  	$scope.addFeedback = function(form){
  		$scope.submitted = true;
  		$scope.comment.createdAt = Date.now()

  		if(form.$valid){
  			Comment.save($scope.comment, function(data){
  			  console.log(data)
  			  $scope.comments.push($scope.comment);
  			  $scope.comment = {};
  			  $state.reload()
  			}),
  			function(err){
  			  console.log(err)
  			}
  		}
  	}
  

  });
