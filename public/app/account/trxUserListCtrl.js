angular.module('app')
  .controller('trxUserListCtrl', ['$scope', 'trxUser', 'trxNotifier',
    function($scope, trxUser, trxNotifier) {
      $scope.users = trxUser.query();

      $scope.edit = function(user) {
        $scope.user = user;
        $scope.editorTitle = 'Edit ' + user.username;
      }

      $scope.save = function() {
        return $scope.user.$update().then(function() {
          $scope.user = undefined;
          $scope.editorTitle = undefined;
        }, function(response) {
        	trxNotifier.error('Update Failed: ' + response.data.reason);
        });
      };

      $scope.cancel = function() {
        $scope.user = undefined;
        $scope.editorTitle = undefined;
      }

      $scope.create = function() {
        console.log("Well ain't that this shit?  Create is not written yet.");
      };
    }
  ])