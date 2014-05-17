angular.module('app')
  .controller('trxUserListCtrl', ['$scope', 'trxUser',
    function($scope, trxUser) {
      $scope.users = trxUser.query();

      $scope.update = function(user) {
        var myScope = $scope;
      };

      $scope.create = function() {
        console.log("Well ain't that this shit?  I am not done yet.");
      };
    }
  ])