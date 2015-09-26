(function() {
  'use strict';

  angular.module('homeTrax.auth').controller('loginController', LoginController);

  function LoginController($location, authService, notifier) {
    var self = this;
    self.signin = function(username, password) {
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