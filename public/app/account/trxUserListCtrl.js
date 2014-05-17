angular.module('app')
  .controller('trxUserListCtrl', ['$scope', 'trxUser',
    function($scope, trxUser) {
      $scope.users = trxUser.query();

      $scope.update = function(user) {
        user.$update();
      };

      $scope.create = function() {
        console.log("Well ain't that this shit?  Create is not written yet.");
      };
    }
  ])