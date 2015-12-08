(function() {
  'use strict';

  angular.module('homeTrax.main.shellController', [
    'homeTrax.auth.AuthEvents'
  ]).controller('shellController', ShellController);

  function ShellController($scope, $state, AuthEvents) {
    $scope.$on(AuthEvents.notAuthenticated, function() {
      $state.go('app.login');
    });

    // TODO: Change this after getting the errors from the server sorted out...
    $scope.$on(AuthEvents.notAuthorized, function() {
      $state.path('app.login');
    });
  }
}());