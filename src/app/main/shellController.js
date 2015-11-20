(function() {
  'use strict';

  angular.module('homeTrax.main.shellController', [
    'homeTrax.auth.AuthEvents'
  ]).controller('shellController', ShellController);

  function ShellController($scope, $location, AuthEvents) {
    $scope.$on(AuthEvents.notAuthenticated, function() {
      $location.path('/login');
    });

    // TODO: Change this after getting the errors from the server sorted out...
    $scope.$on(AuthEvents.notAuthorized, function() {
      $location.path('/login');
    });
  }
}());