angular.module('app')
  .controller('trxLoginCtrl', function($scope, $location, trxAuthService, trxNotifier) {
    $scope.signin = function(username, password) {
      trxAuthService.authenticateUser(username, password)
        .then(function(success) {
          if (success) {
            trxNotifier.notify('Welcome Home!');
            $location.path('/').replace();
          } else {
            trxNotifier.error('Login Failed!');
          }
        });
    }
  });