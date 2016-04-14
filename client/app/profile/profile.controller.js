'use strict';

angular.module('gobeApp')
  .controller('ProfileCtrl', function ($scope, $filter, currentUser, Auth, Path, customerInfo) {
    
    $scope.user = currentUser;
    $scope.isAdmin = Auth.isAdmin;
    $scope.path = Path.transitionToPath;
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

  });
