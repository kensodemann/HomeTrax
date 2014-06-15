angular.module('app')
  .controller('mainCtrl', function($scope, identity) {
  	var message = "Hello World from Angular!!";

  	if (identity.isAuthenticated()){
  		message += "  I am logged in!"
  	}

    $scope.hello = message;
  });