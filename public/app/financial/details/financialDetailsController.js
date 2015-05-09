(function() {
  'use strict';

  angular.module('app.financial').controller('financialDetailsController', FinancialDetailsController);

  function FinancialDetailsController($routeParams, FinancialAccount, HomeAppEvent, eventTypes) {
    var controller = {
      activate: function() {
        controller.account = FinancialAccount.get({id: $routeParams.id});
        controller.transactions = HomeAppEvent.query({
          accountRid: $routeParams.id,
          eventType: eventTypes.transaction
        });
      },

      addTransaction: function() {
        var newEvent = new HomeAppEvent();
        newEvent.eventType = eventTypes.transaction;
        newEvent.accountRid = controller.account._id;
        newEvent.editMode = true;
        controller.editMode = true;
        controller.transactions.unshift(newEvent);
      },

      editTransaction: function(trans) {
        copyToTransactionEditor(trans);
        trans.editMode = true;
        controller.editMode = true;
      },

      saveTransaction: function(trans) {
        var backup = {};
        $.extend(backup, trans);
        trans.editMode = undefined;
        copyFromTransactionEditor(trans);
        trans.$save(success, error);

        function success() {
          controller.editMode = false;
        }

        function error() {
          $.extend(trans, backup);
        }
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

    function copyToTransactionEditor(trans) {
      controller.transactionEditor = {
        description: trans.description,
        date: trans.transactionDate,
        principal: trans.principalAmount,
        interest: trans.interestAmount
      };
    }

    function copyFromTransactionEditor(trans) {
      trans.description = controller.transactionEditor.description;
      trans.transactionDate = controller.transactionEditor.date;
      trans.principalAmount = controller.transactionEditor.principal;
      trans.interestAmount = controller.transactionEditor.interest;
    }
  }
}());
  