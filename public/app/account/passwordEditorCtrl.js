'use strict'

angular.module('app')
  .controller('passwordEditorCtrl', ['$scope', '$modalInstance', 'passwordModel',
    function($scope, $modalInstance, passwordModel) {
      $scope.newPasswordIsValid = false;
      $scope.model = passwordModel;
      $scope.errorMessage = '';

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

      $scope.ok = function() {
        $scope.model.$update(function() {
          $modalInstance.close();
        }, function(response) {
          $scope.errorMessage = response.data.reason;
        });
      }

      $scope.validatePassword = function() {
        if (!$scope.model.newPassword || $scope.model.newPassword.length < 8) {
          $scope.newPasswordIsValid = false;
          $scope.errorMessage = 'New password must be at least 8 characters long';
          return;
        }
        if ($scope.model.newPassword !== $scope.model.verifyPassword) {
          $scope.newPasswordIsValid = false;
          $scope.errorMessage = 'Passwords do not match';
          return;
        }

        $scope.newPasswordIsValid = true;
        $scope.errorMessage = '';
      }

      $scope.validatePassword();
    }
  ])