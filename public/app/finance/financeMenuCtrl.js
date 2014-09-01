angular.module('app')
  .controller('financeMenuCtrl', ['$scope', 'identity',
    function($scope, identity) {
      $scope.identity = identity;
    }
  ])