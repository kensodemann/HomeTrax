angular.module('app')
  .controller('trxLoginMenuCtrl', ['$scope', 'trxIdentity', 'trxAuthentication', '$location',
    function($scope, trxIdentity, trxAuthentication, $location) {
      $scope.identity = trxIdentity;

      $scope.logout = function() {
        trxAuthentication.logoutUser()
          .then(function() {
            $location.path('/login');
          });
      };
    }
  ])