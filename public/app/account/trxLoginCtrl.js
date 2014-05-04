angular.module('app')
  .controller('trxLoginCtrl', function($scope, $location, trxAuthService) {
    $scope.signin = function(username, password) {
      trxAuthService.authenticateUser(username, password)
        .then(function(success) {
          if (success) {
            $location.path('/').replace();
          }
        });
    }
  });