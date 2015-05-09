(function() {
  'use strict';

  angular.module('app.financial').factory('financialAccountEditor', FinancialAccountEditor);

  function FinancialAccountEditor($rootScope, $modal, financialAccountTypes) {
    var service = {
      open: open
    };

    var editorScope = $rootScope.$new(true);
    var editor = $modal({
      template: '/partials/financial/accountEditor/template',
      backdrop: 'static',
      scope: editorScope,
      show: false
    });

    createEditorScope();

    return service;


    function open(account, mode) {
      setTitle(mode);
      copyAccount(account);
      editor.$promise.then(function() {
        editor.show();
      });
    }

    function setTitle(mode) {
      if (mode === 'edit') {
        editorScope.controller.title = 'Modify Account';
      } else {
        editorScope.controller.title = 'New Account';
      }
    }

    function copyAccount(account) {
      editorScope.controller.name = account.name;
      editorScope.controller.bank = account.bank;
      editorScope.controller.accountNumber = account.accountNumber;
      editorScope.controller.accountType = findAccountType(account.accountType);
      editorScope.controller.amount = account.amount;
      editorScope.account = account;
    }

    function findAccountType(t) {
      var matching = $.grep(financialAccountTypes, function(acctType) {
        return acctType.accountType === t;
      });
      return matching.length > 0 ? matching[0] : financialAccountTypes[0];
    }


    function createEditorScope() {
      editorScope.controller = {
        accountTypes: financialAccountTypes,
        save: save
      };
    }

    function save() {
      copyEnteredData();
      editorScope.account.$save(success, error);

      function success() {
        editor.hide();
      }

      function error(response) {
        editorScope.controller.errorMessage = response.data.reason;
      }
    }

    function copyEnteredData() {
      var acct = editorScope.account;
      var controller = editorScope.controller;

      acct.name = controller.name;
      acct.bank = controller.bank;
      acct.accountNumber = controller.accountNumber;
      acct.accountType = controller.accountType.accountType;
      acct.balanceType = controller.accountType.balanceType;
      acct.amount = Number(controller.amount);
    }
  }
}());