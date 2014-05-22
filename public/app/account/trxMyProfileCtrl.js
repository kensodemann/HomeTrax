angular.module('app')
  .controller('trxMyProfileCtrl', ['$scope', 'trxIdentity',
    function($scope, trxIdentity) {
      $scope.setPassword = function() {
        $scope.passwordData = new Object();
        $scope.passwordData._id = trxIdentity.currentUser._id;
      }

      $scope.cancelPasswordChange = function() {
        $scope.passwordData = undefined;
      }
    }
  ]);