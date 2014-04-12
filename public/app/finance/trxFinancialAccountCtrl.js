angular.module('app')
  .controller('trxFinancialAccountCtrl', function($scope, $location) {
    $scope.message = "Hello World from the Angular Financial Account Controller!!";
    $scope.accountName = ($location.search()).acct;
  });