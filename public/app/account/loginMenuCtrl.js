(function() {
  'use strict';

  angular.module('app').controller('loginMenuCtrl', LoginMenuCtrl);

  function LoginMenuCtrl($scope, identity, authService, $location) {
    $scope.identity = identity;

    $scope.logout = function() {
      authService.logoutUser().then(navigateToLogin);

      function navigateToLogin(){
        $location.path('/login');
      }
    };
  }
}());