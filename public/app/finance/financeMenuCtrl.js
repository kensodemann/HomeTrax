(function() {
  'use strict';

  angular.module('app').controller('financeMenuCtrl', FinanceMenuCtrl);

  function FinanceMenuCtrl(identity) {
    this.identity = identity;
  }
}());

