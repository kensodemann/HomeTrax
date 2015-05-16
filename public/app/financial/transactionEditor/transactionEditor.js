(function() {
  'use strict';

  angular.module('app.financial')
    .factory('transactionEditor', TransactionEditor);

  function TransactionEditor($modal, Editor) {
    var editor = new Editor($modal, '/partials/financial/transactionEditor/template', 'Transaction');

    editor.copyToController = function(model) {
      var controller = editor.editorScope.controller;
      controller.transactionDate = model.transactionDate;
      controller.description = model.description;
      controller.principalAmount = model.principalAmount;
      controller.interestAmount = model.interestAmount;
      Editor.prototype.copyToController.call(editor, model);
    };

    editor.copyToResourceModel = function(){
      var model = editor.editorScope.model;
      var controller = editor.editorScope.controller;

      model.transactionDate = controller.transactionDate;
      model.description = controller.description;
      model.principalAmount = Number(controller.principalAmount);
      model.interestAmount = Number(controller.interestAmount);
    };

    return {
      open: function(transaction, mode, saveCallback) {
        editor.open(transaction, mode, saveCallback);
      }
    };
  }
}());