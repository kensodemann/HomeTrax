(function() {
  'use strict';

  angular.module('app.financial').factory('financialAccountEditor', FinancialAccountEditor);

  function FinancialAccountEditor($modal, Editor, financialAccountTypes, Entity) {
    var editor = new Editor($modal, 'app/financial/accountEditor/template.html', 'Account');
    editor.editorScope.controller.accountTypes = financialAccountTypes;

    editor.copyToController = function(model) {
      var controller = editor.editorScope.controller;
      controller.entities = Entity.query();
      controller.entities.$promise.then(function() {
        controller.entity = findEntity(controller.entities, model.entityRid);
      });
      controller.name = model.name;
      controller.bank = model.bank;
      controller.accountType = findAccountType(model.accountType);
      controller.amount = model.amount;
      Editor.prototype.copyToController.call(editor, model);
    };
    editor.copyToResourceModel = function() {
      var model = editor.editorScope.model;
      var controller = editor.editorScope.controller;

      model.name = controller.name;
      model.bank = controller.bank;
      model.accountType = controller.accountType.accountType;
      model.balanceType = controller.accountType.balanceType;
      model.amount = Number(controller.amount);
      if (controller.accountType.balanceType === 'liability' && !!controller.entity) {
        model.entityRid = controller.entity._id;
      }
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

    function findEntity(entities, rid) {
      var matching = $.grep(entities, function(e) {
        return e._id === rid;
      });
      return matching[0];
    }
  }
}());