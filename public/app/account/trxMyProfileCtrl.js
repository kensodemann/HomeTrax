angular.module('app')
  .controller('trxMyProfileCtrl', ['$scope', 'trxUser', 'trxIdentity',
    function($scope, trxUser, trxIdentity) {
      $scope.user = trxUser.get({
        id: trxIdentity.currentUser._id
      });

      $scope.reset = function() {
        $scope.user = trxUser.get({
          id: trxIdentity.currentUser._id
        });
      };

      $scope.save = function() {
        $scope.user.$update();
      };

      $scope.setPassword = function() {
        $scope.passwordData = new trxUser();
        $scope.passwordData._id = trxIdentity.currentUser._id;
      };

      $scope.cancelPasswordChange = function() {
        $scope.passwordData = undefined;
      };

      $scope.changePassword = function() {

      };
    }
  ]);