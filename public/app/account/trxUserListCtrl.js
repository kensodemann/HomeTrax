angular.module('app')
  .controller('trxUserListCtrl', ['$scope', 'trxUser', 'trxNotifier',
    function($scope, trxUser, trxNotifier) {
      $scope.users = trxUser.query();

      $scope.edit = function(user) {
        $scope.user = user;
        $scope.editorTitle = 'Edit ' + user.username;
        $scope.mode = 'edit';
      }

      $scope.save = function() {
        if ($scope.editorTitle === 'New User') {
          return createNewUser();
        } else {
          return updateUser();
        }
      };

      function createNewUser() {
        $scope.user.verifyPassword = undefined;
        $scope.user.$save().then(function(user) {
          $scope.user = undefined;
          $scope.editorTitle = undefined;
          $scope.users.push(user);
        }, function(response) {
          trxNotifier.error('Create New User Failed: ' + response.data.reason);
        });
      }

      function updateUser() {
        return $scope.user.$update().then(function() {
          $scope.user = undefined;
          $scope.editorTitle = undefined;
        }, function(response) {
          trxNotifier.error('Update Failed: ' + response.data.reason);
        });
      }

      $scope.cancel = function() {
        $scope.user = undefined;
        $scope.editorTitle = undefined;
      };

      $scope.create = function() {
        $scope.user = new trxUser();
        $scope.editorTitle = 'New User';
        $scope.mode = 'create';
        $scope.passwordEntryChanged();
      };

      $scope.passwordEntryChanged = function() {
        if (!$scope.user.password || $scope.user.password.length < 8) {
          $scope.passwordIsValid = false;
          $scope.passwordErrorMessage = 'New password must be at least 8 characters long';
          return;
        }
        if ($scope.user.password !== $scope.user.verifyPassword) {
          $scope.passwordIsValid = false;
          $scope.passwordErrorMessage = 'Passwords do not match';
          return;
        }

        $scope.passwordIsValid = true;
        $scope.passwordErrorMessage = '';
      }
    }
  ])