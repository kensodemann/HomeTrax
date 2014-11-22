(function() {
  'use strict';

  angular.module('app').controller('financeMenuCtrl', FinanceMenuCtrl);

  function FinanceMenuCtrl($scope, identity) {
    $scope.identity = identity;
  }
}());

