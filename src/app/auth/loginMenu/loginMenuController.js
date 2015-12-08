(function() {
  'use strict';

  angular.module('homeTrax.auth.loginMenu', [
    'homeTrax.auth.authService',
    'homeTrax.auth.identity'
  ]).controller('loginMenuController', LoginMenuController);

  function LoginMenuController(identity, authService, $state) {
    var controller = this;

    controller.identity = identity;
    controller.logout = logout;

    function logout() {
      authService.logoutUser().then(navigateToLogin);

      function navigateToLogin() {
        $state.go('app.login');
      }
    }
  }
}());