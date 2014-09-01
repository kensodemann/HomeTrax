'use strict'

angular.module('app')
  .controller('userEditorCtrl', ['$scope', '$modalInstance', 'userModel',
    function($scope, $modalInstance, userModel) {
      $scope.model = {
        firstName: userModel.firstName,
        lastName: userModel.lastName,
        username: userModel.username
      };

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
        copyEditorModelToDataModel();
        userModel.password = $scope.model.password;
        userModel.$save(function(u, responseHeaders) {
          $modalInstance.close(u);
        }, function(response) {
          $scope.errorMessage = response.data.reason;
        });
      }

      function updateUser() {
        copyEditorModelToDataModel();
        userModel.$update(function(u, responseHeaders) {
          $modalInstance.close(u);
        }, function(response) {
          $scope.errorMessage = response.data.reason;
        });
      }

      function copyEditorModelToDataModel(){
        userModel.firstName = $scope.model.firstName;
        userModel.lastName = $scope.model.lastName;
        userModel.username = $scope.model.username;
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