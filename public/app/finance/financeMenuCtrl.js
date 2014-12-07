(function() {
  'use strict';

  angular.module('app.finance').controller('financeMenuCtrl', FinanceMenuCtrl);

  function FinanceMenuCtrl(identity) {
    this.identity = identity;
  }
}());

