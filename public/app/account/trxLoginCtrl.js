angular.module('app')
  .controller('trxLoginCtrl', function($scope, $location, trxAuthentication) {
    $scope.signin = function(username, password) {
      trxAuthentication.authenticateUser(username, password)
        .then(function(success) {
          if (success) {
            $location.path('/').replace();
          }
        });
    }
  });