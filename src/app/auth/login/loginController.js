(function() {
  'use strict';

  angular.module('homeTrax.auth.login', [
      'ui.router',
      'homeTrax.auth.authService',
      'homeTrax.common.directives.htWaitButton',
      'homeTrax.common.services.notifier'
    ]).controller('loginController', LoginController)
    .config(function($stateProvider) {
      $stateProvider.state('app.login', {
        url: '/login',
        views: {
          mainShell: {
            templateUrl: 'app/auth/login/login.html',
            controller: 'loginController as controller'
          }
        }
      });
    });

  function LoginController($state, authService, notifier) {
    var controller = this;
    
    controller.signin = function(username, password) {
      var p = authService.authenticateUser(username, password);
      p.then(handleResult);
      return p;

      function handleResult(success) {
        if (success) {
          notifier.notify('Welcome Home!');
          $state.go('app.main');
        }
        else {
          notifier.error('Login Failed!');
        }
      }
    };
  }
}());