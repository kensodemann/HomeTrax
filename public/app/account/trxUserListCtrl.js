angular.module('app')
  .controller('trxUserListCtrl', ['$scope', 'trxUser', 'trxNotifier',
    function($scope, trxUser, trxNotifier) {
      $scope.users = trxUser.query();

      $scope.edit = function(user) {
        $scope.user = user;
        $scope.editorTitle = 'Edit ' + user.username;
      }

      $scope.save = function() {
        if ($scope.editorTitle === 'New User') {
          return createNewUser();
        } else {
          return updateUser();
        }
      };

      function createNewUser() {
        var newUser = trxUser.save($scope.user, function() {
          $scope.user = undefined;
          $scope.editorTitle = undefined;
          $scope.users.push(newUser);
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
        $scope.user = new Object();
        $scope.editorTitle = 'New User';
      };
    }
  ])