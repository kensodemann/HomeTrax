angular.module('app')
  .controller('loginMenuCtrl', ['$scope', 'identity', 'authService', '$location',
    function($scope, identity, authService, $location) {
      $scope.identity = identity;

      $scope.logout = function() {
        authService.logoutUser()
          .then(function() {
            $location.path('/login');
          });
      };
    }
  ])