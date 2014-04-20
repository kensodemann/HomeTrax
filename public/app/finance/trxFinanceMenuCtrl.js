angular.module('app')
  .controller('trxFinanceMenuCtrl', ['$scope', 'trxIdentity',
    function($scope, trxIdentity) {
      $scope.identity = trxIdentity;
    }
  ])