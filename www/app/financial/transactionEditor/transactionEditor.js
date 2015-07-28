(function() {
  'use strict';

  angular.module('app.financial')
    .factory('transactionEditor', TransactionEditor);

  function TransactionEditor($modal, Editor, transactionTypes, balanceTypes) {
    var editor = new Editor($modal, 'app/financial/transactionEditor/template.html', 'Transaction');
    var controller = editor.editorScope.controller;
    controller.transactionTypes = transactionTypes;

    editor.copyToController = function(model) {
      controller.transactionDate = model.transactionDate;
      controller.description = model.description;
      controller.principalAmount = model.principalAmount;
      controller.interestAmount = model.interestAmount;
      controller.transactionType = findTransactionType(model.transactionType) || transactionTypes[0];
      Editor.prototype.copyToController.call(editor, model);
    };

    editor.copyToResourceModel = function(){
      var model = editor.editorScope.model;

      model.transactionDate = controller.transactionDate;
      model.description = controller.description;
      model.principalAmount = Number(controller.principalAmount);
      model.interestAmount = Number(controller.interestAmount);

      if (controller.account.balanceType === balanceTypes.liability){
        model.transactionType = controller.transactionType.transactionType;
        if (model.transactionType === 'disbursement'){
          model.principalAmount *= -1;
        }
      }
    };

    function findTransactionType(transType){
      var matching = $.grep(transactionTypes, function(tt){
        return tt.transactionType === transType;
      });
      return matching[0];
    }

    return {
      open: function(account, transaction, mode, saveCallback) {
        controller.account = account;
        editor.open(transaction, mode, saveCallback);
      }
    };
  }
}());