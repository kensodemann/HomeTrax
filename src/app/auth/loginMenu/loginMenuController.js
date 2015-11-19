(function() {
  'use strict';

  angular.module('homeTrax.auth.loginMenu', [
    'homeTrax.auth.authService',
    'homeTrax.auth.identity'
  ]).controller('loginMenuController', LoginMenuController);

  function LoginMenuController(identity, authService, $location) {
    var self = this;

    self.identity = identity;
    self.logout = logout;

    function logout() {
      authService.logoutUser().then(navigateToLogin);

      function navigateToLogin() {
        $location.path('/login');
      }
    }
  }
}());