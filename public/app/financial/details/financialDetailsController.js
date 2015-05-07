(function() {
  'use strict';

  angular.module('app.financial').controller('financialDetailsController', FinancialDetailsController);

  function FinancialDetailsController($routeParams, FinancialAccount, HomeAppEvent) {
    var controller = {
      activate: function() {
        controller.account = FinancialAccount.get({id: $routeParams.id});
        controller.transactions = HomeAppEvent.query({
          accountRid: $routeParams.id,
          eventType: 'transaction'
        });
      },

      addTransaction: function() {
        var newEvent = new HomeAppEvent();
        newEvent.eventType = 'transaction';
        newEvent.editMode = true;
        controller.editMode = true;
        controller.transactions.unshift(newEvent);
      },

      editTransaction: function(trans) {
        copyToTransactionEditor(trans);
        trans.editMode = true;
        controller.editMode = true;
      },

      headerLines: [{
        label: 'Name:',
        columnName: 'name',
        modes: 'EV'
      }, {
        label: 'Bank Name:',
        columnName: 'bank',
        modes: 'EV'
      }, {
        label: 'Account #:',
        columnName: 'accountNumber',
        modes: 'EV'
      }, {
        label: 'Opening Balance:',
        columnName: 'amount',
        modes: 'E'
      }]
    };

    controller.activate();

    return controller;

    function copyToTransactionEditor(trans){
      controller.transactionEditor = {
        description: trans.description,
        date: trans.transactionDate,
        principal: trans.principalAmount,
        interest: trans.interestAmount
      };
    }
  }
}());
  