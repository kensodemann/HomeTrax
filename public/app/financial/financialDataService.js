(function() {
  'use strict';

  angular.module('app.financial').factory('financialDataService', financialDataService);

  function financialDataService(FinancialAccount) {
    var service = {
      init: function() {
        if (!service.allAccounts){
          service.allAccounts = FinancialAccount.query();
        }
      }
    };

    return service;
  }
}());