angular.module('app')
  .controller('trxMyProfileCtrl', ['$scope', 'trxIdentity',
    function($scope, trxIdentity) {
    	$scope.message = "Welcome to my profile, I hope you like it.";
    }
  ]);