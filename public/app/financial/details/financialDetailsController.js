(function() {
  'use strict';

  angular.module('app.financial').controller('financialDetailsController', FinancialDetailsController);

  function FinancialDetailsController($routeParams, FinancialAccount, financialAccountEditor, HomeAppEvent,
                                      eventTypes, transactionEditor, editorModes) {
    var controller = {
      activate: function() {
        controller.account = FinancialAccount.get({id: $routeParams.id});
        controller.transactions = HomeAppEvent.query({
          accountRid: $routeParams.id,
          eventType: eventTypes.transaction
        });
      },

      addTransaction: function() {
        var newEvent = new HomeAppEvent({
          eventType: eventTypes.transaction,
          accountRid: controller.account._id
        });
        transactionEditor.open(newEvent, editorModes.create, function() {
          controller.transactions.unshift(newEvent);
        });
      },

      editTransaction: function(trans) {

      },

      editAccount: function() {
        var account = {};
        $.extend(account, controller.account);
        financialAccountEditor.open(account, editorModes.modify, copyChanges);

        function copyChanges(acct) {
          $.extend(controller.account, acct);
        }
      }
    };

    controller.activate();

    return controller;
  }
}());
  