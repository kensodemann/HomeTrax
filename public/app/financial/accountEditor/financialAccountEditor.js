(function() {
  'use strict';

  angular.module('app.financial').factory('financialAccountEditor', FinancialAccountEditor);

  function FinancialAccountEditor($modal, Editor, financialAccountTypes, Entity) {
    var editor = new Editor($modal, '/partials/financial/accountEditor/template', 'Account');
    editor.editorScope.controller.accountTypes = financialAccountTypes;
    editor.editorScope.controller.entities = Entity.query();

    editor.copyToController = function(model) {
      var controller = editor.editorScope.controller;
      controller.name = model.name;
      controller.bank = model.bank;
      controller.accountNumber = model.accountNumber;
      controller.accountType = findAccountType(model.accountType);
      controller.amount = model.amount;
      Editor.prototype.copyToController.call(editor, model);
    };

    editor.copyToResourceModel = function(){
      var model = editor.editorScope.model;
      var controller = editor.editorScope.controller;

      model.name = controller.name;
      model.bank = controller.bank;
      model.accountNumber = controller.accountNumber;
      model.accountType = controller.accountType.accountType;
      model.balanceType = controller.accountType.balanceType;
      model.amount = Number(controller.amount);
    };

    return {
      open: function(account, mode, saveCallback) {
        editor.open(account, mode, saveCallback);
      }
    };

    function findAccountType(t) {
      var matching = $.grep(financialAccountTypes, function(acctType) {
        return acctType.accountType === t;
      });
      return matching.length > 0 ? matching[0] : financialAccountTypes[0];
    }
  }
}());