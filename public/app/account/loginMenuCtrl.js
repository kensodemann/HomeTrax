(function() {
  'use strict';

  angular.module('app').controller('loginMenuCtrl', LoginMenuCtrl);

  function LoginMenuCtrl($scope, identity, authService, $location) {
    $scope.identity = identity;

    $scope.logout = function() {
      authService.logoutUser()
        .then(function() {
          $location.path('/login');
        });
    };
  }
}());