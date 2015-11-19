(function() {
  'use strict';

  angular.module('homeTrax.auth.login', [
    'ngRoute',
    'homeTrax.auth.authService',
    'homeTrax.common.services.notifier'
  ])
    .controller('loginController', LoginController)
    .config(function($routeProvider) {
      $routeProvider.when('/login', {
        templateUrl: 'app/auth/login/login.html',
        controller: 'loginController',
        controllerAs: 'controller'
      });
    });

  function LoginController($location, authService, notifier) {
    var self = this;
    self.signin = function(username, password) {
      var p = authService.authenticateUser(username, password);
      p.then(handleResult);
      return p;

      function handleResult(success) {
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