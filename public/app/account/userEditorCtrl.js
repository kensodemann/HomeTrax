'use strict'

angular.module('app')
  .controller('userEditorCtrl', ['$scope', '$modalInstance', 'userModel',
    function($scope, $modalInstance, userModel) {
      $scope.model = userModel;

      $scope.title = userModel._id ? 'Edit User' : 'Create New User';
      $scope.mode = userModel._id ? 'edit' : 'create';
      $scope.errorMessage = '';
      $scope.passwordIsValid = false;

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

      $scope.ok = function() {
        var action = ($scope.mode === 'edit') ? $scope.model.$update : $scope.model.$save;
        action(function(u, responseHeaders) {
          $modalInstance.close(u);
        }, function(response) {
          $scope.errorMessage = response.statusText;
        });
      };

      $scope.validatePassword = function() {
        if (!$scope.model.password || $scope.model.password.length < 8) {
          $scope.passwordIsValid = false;
          $scope.errorMessage = 'New password must be at least 8 characters long';
          return;
        }
        if ($scope.model.password !== $scope.model.verifyPassword) {
          $scope.passwordIsValid = false;
          $scope.errorMessage = 'Passwords do not match';
          return;
        }

        $scope.passwordIsValid = true;
        $scope.errorMessage = '';
      };

      if (userModel._id) {
        $scope.passwordIsValid = true;
      } else {
        $scope.validatePassword();
      }
    }
  ]);