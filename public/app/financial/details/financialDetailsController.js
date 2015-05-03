(function() {
  'use strict';

  angular.module('app.financial').controller('financialDetailsController', FinancialDetailsController);

  function FinancialDetailsController($routeParams, FinancialAccount) {
    var controller = {
      activate: function() {
        controller.account = FinancialAccount.get({id: $routeParams.id});
      },

      headerLines: [{
        label: 'Name:',
        columnName: 'name',
        modes: 'EV'
      },{
        label: 'Bank Name:',
        columnName: 'bank',
        modes: 'EV'
      },{
        label: 'Account #:',
        columnName: 'accountNumber',
        modes: 'EV'
      },{
        label: 'Opening Balance:',
        columnName: 'amount',
        modes: 'E'
      }]
    };

    controller.activate();

    return controller;
  }
}());
  