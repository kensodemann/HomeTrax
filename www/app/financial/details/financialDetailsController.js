(function() {
  'use strict';

  angular.module('app.financial').controller('financialDetailsController', FinancialDetailsController);

  function FinancialDetailsController($routeParams, FinancialAccount, financialAccountEditor, HomeAppEvent,
                                      eventTypes, transactionEditor, editorModes, messageDialogService) {
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
        transactionEditor.open(controller.account, newEvent, editorModes.create, function() {
          controller.transactions.unshift(newEvent);
        });
      },

      deleteTransaction: function(trans) {
        messageDialogService.ask('Are you sure you want to delete this transaction?', 'Delete Transaction')
          .then(function(yes){
            if(yes){
              trans.$delete(function(){
                var index = controller.transactions.indexOf(trans);
                if (index > -1){
                  controller.transactions.splice(index, 1);
                }
              });
            }
          });
      },

      editTransaction: function(trans) {
        transactionEditor.open(controller.account, trans, editorModes.edit);
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
  