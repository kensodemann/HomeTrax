(function() {
  'use strict';

  angular.module('app.financial').factory('FinancialAccount', FinancialAccount);

  function FinancialAccount(HomeAppResource) {
    return new HomeAppResource('accounts');
  }
}());