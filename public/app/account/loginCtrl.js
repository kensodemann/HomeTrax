angular.module('app')
  .controller('loginCtrl', function($scope, $location, authService, notifier) {
    $scope.signin = function(username, password) {
      authService.authenticateUser(username, password)
        .then(function(success) {
          if (success) {
            notifier.notify('Welcome Home!');
            $location.path('/').replace();
          } else {
            notifier.error('Login Failed!');
          }
        });
    }
  });