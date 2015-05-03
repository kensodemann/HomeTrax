(function() {
  'use strict';

  angular.module('app.financial')
    .controller('financialSummaryController', FinancialSummaryController);

  function FinancialSummaryController(financialAccountEditor, FinancialAccount) {
    var controller = {
      activate: function() {
        getAccounts();
      },

      addAccountClicked: function() {
        var acct = new FinancialAccount();
        financialAccountEditor.open(acct, 'create');
      },

      addAccountTooltip: {
        title: "Add a new account"
      },

      liabilityAccounts: [],
      assetAccounts: []
    };

    controller.activate();

    return controller;

    function getAccounts() {
      FinancialAccount.query(function(accts) {
        controller.liabilityAccounts = $.grep(accts, isLiabilityAccount);
        controller.assetAccounts = $.grep(accts, isAssetAccount);
      });
    }

    function isLiabilityAccount(acct){
      return acct.balanceType === 'liability';
    }

    function isAssetAccount(acct){
      return acct.balanceType === 'asset';
    }
  }
}());