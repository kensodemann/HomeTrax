(function() {
  'use strict';

  angular.module('app').controller('loginMenuCtrl', LoginMenuCtrl);

  function LoginMenuCtrl(identity, authService, $location) {
    var self = this;

    self.identity = identity;
    self.logout = logout;

    function logout() {
      authService.logoutUser().then(navigateToLogin);

      function navigateToLogin(){
        $location.path('/login');
      }
    }
  }
}());