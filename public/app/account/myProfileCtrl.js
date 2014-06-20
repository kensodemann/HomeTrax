angular.module('app')
  .controller('myProfileCtrl', ['$scope', 'user', 'userPassword', 'identity', 'notifier',
    function($scope, user, userPassword, identity, notifier) {
      $scope.user = user.get({
        id: identity.currentUser._id
      });

      $scope.reset = function() {
        $scope.user = user.get({
          id: identity.currentUser._id
        });
      };

      $scope.save = function() {
        $scope.user.$update();
      };

      $scope.getNewPassword = function() {
        $scope.passwordData = new userPassword();
        $scope.passwordData._id = identity.currentUser._id;
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
            notifier.notify('Password Changed Successfully')
            $scope.passwordData = undefined;
            $scope.newPasswordErrorMessage = '';
          }, function(response) {
            $scope.newPasswordErrorMessage = 'ERROR: ' + response.data.reason;
            notifier.error('Password Change Failed: ' + response.data.reason);
          });
      };
    }
  ]);