angular.module('app')
  .controller('trxLoginMenuCtrl', ['$scope', 'trxIdentity', 'trxAuthService', '$location',
    function($scope, trxIdentity, trxAuthService, $location) {
      $scope.identity = trxIdentity;

      $scope.logout = function() {
        trxAuthService.logoutUser()
          .then(function() {
            $location.path('/login');
          });
      };
    }
  ])