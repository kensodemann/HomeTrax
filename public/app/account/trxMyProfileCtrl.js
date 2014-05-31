angular.module('app')
  .controller('trxMyProfileCtrl', ['$scope', 'trxUser', 'trxUserPassword', 'trxIdentity', 'trxNotifier',
    function($scope, trxUser, trxUserPassword, trxIdentity, trxNotifier) {
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
            trxNotifier.notify('Password Changed Successfully')
            $scope.passwordData = undefined;
            $scope.newPasswordErrorMessage = '';
          }, function(response) {
            $scope.newPasswordErrorMessage = 'ERROR: ' + response.data.reason;
            trxNotifier.error('Password Change Failed: ' + response.data.reason);
          });
      };
    }
  ]);