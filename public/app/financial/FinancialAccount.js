(function() {
  'use strict';

  angular.module('app.financial').factory('FinancialAccount', FinancialAccount);

  function FinancialAccount($resource) {
    return $resource('/api/accounts/:id', {
      id: "@_id"
    });
  }
}());