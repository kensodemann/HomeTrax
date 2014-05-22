angular.module('app')
  .controller('trxMyProfileCtrl', ['$scope', 'trxUser', 'trxIdentity',
    function($scope, trxUser, trxIdentity) {
      $scope.user = trxUser.get({
        id: trxIdentity.currentUser._id
      });

      $scope.setPassword = function() {
        $scope.passwordData = new Object();
        $scope.passwordData._id = trxIdentity.currentUser._id;
      }

      $scope.cancelPasswordChange = function() {
        $scope.passwordData = undefined;
      }
    }
  ]);