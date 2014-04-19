angular.module('app')
  .controller('trxMainCtrl', function($scope, trxIdentity) {
  	var message = "Hello World from Angular!!";

  	if (trxIdentity.isAuthenticated()){
  		message += "  I am logged in!"
  	}

    $scope.hello = message;
  });