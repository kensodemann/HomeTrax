angular.module('app')
  .controller('trxUserListCtrl', ['$scope', 'trxUser',
    function($scope, trxUser) {
      $scope.users = trxUser.query();

      $scope.update = function(user) {
        user.$update().then(function() {
          console.log('It worked');
        }, function(response) {
          console.log('It Failed: ' + response.data.reason);
        });
      };

      $scope.create = function() {
        console.log("Well ain't that this shit?  Create is not written yet.");
      };
    }
  ])