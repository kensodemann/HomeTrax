angular.module('app')
  .controller('trxMyProfileCtrl', ['$scope', 'trxUser', 'trxUserPassword', 'trxIdentity',
    function($scope, trxUser, trxUserPassword, trxIdentity) {
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

      $scope.getNewPassword = function() {
        $scope.passwordData = new trxUserPassword();
        $scope.passwordData._id = trxIdentity.currentUser._id;
        $scope.passwordEntryChanged();
      };

      $scope.passwordEntryChanged = function() {
        if (!$scope.passwordData.newPassword || $scope.passwordData.newPassword.length < 8) {
          $scope.newPasswordIsValid = false;
          $scope.newPasswordErrorMessage = 'New password must be at least 8 characters long';
          return;
        }
        if ($scope.passwordData.newPassword !== $scope.passwordData.verifyPassword) {
          $scope.newPasswordIsValid = false;
          $scope.newPasswordErrorMessage = 'Passwords do not match';
          return;
        }

        $scope.newPasswordIsValid = true;
        $scope.newPasswordErrorMessage = '';
      }

      $scope.cancelPasswordChange = function() {
        $scope.passwordData = undefined;
      };

      $scope.changePassword = function() {
        $scope.passwordData.$update()
          .then(function() {
            $scope.passwordData = undefined;
          });
      };
    }
  ]);