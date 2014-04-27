angular.module('app')
  .controller('trxUserAdminMenuCtrl', ['$scope', 'trxIdentity',
    function($scope, trxIdentity) {
      $scope.identity = trxIdentity;
    }
  ])