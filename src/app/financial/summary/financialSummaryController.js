(function() {
  'use strict';

  angular.module('app.financial')
    .controller('financialSummaryController', FinancialSummaryController);

  function FinancialSummaryController(financialAccountEditor, FinancialAccount, balanceTypes) {
    var controller = {
      activate: function() {
        getAccounts();
      },

      addAccountClicked: function() {
        var acct = new FinancialAccount();
        financialAccountEditor.open(acct, 'create', accountAdded);

        function accountAdded(acct) {
          acct.balance = acct.amount;
          acct.principalPaid = 0;
          acct.interestPaid = 0;
          if (acct.balanceType === balanceTypes.asset) {
            controller.assetAccounts.push(acct);
          } else {
            controller.liabilityAccounts.push(acct);
          }
        }
      },

      addAccountTooltip: {
        title: 'Add a new account'
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

    function isLiabilityAccount(acct) {
      return acct.balanceType === balanceTypes.liability;
    }

    function isAssetAccount(acct) {
      return acct.balanceType === balanceTypes.asset;
    }
  }
}());