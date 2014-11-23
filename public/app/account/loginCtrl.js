(function() {
  'use strict';

  angular.module('app').controller('loginCtrl', LoginCtrl);

  function LoginCtrl($scope, $location, authService, notifier) {
    $scope.signin = function(username, password) {
      authService.authenticateUser(username, password).then(handleResult);

      function handleResult(success){
        if (success) {
          notifier.notify('Welcome Home!');
          $location.path('/').replace();
        } else {
          notifier.error('Login Failed!');
        }
      }
    };
  }
}());