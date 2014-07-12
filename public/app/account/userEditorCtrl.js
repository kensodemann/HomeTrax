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
        if ($scope.mode === 'edit') {
          updateUser();
        } else {
          createNewUser();
        }
      };

      function createNewUser() {
        $scope.model.$save(function(u, responseHeaders) {
          $modalInstance.close(u);
        }, function(response) {
          $scope.errorMessage = response.statusText;
        });
      }

      function updateUser() {
        $scope.model.$update(function(u, responseHeaders) {
          $modalInstance.close(u);
        }, function(response) {
          $scope.errorMessage = response.statusText;
        });
      }

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