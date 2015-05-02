(function() {
  'use strict';

  angular.module('app.financial')
    .controller('financialSummaryController', FinancialSummaryController);

  function FinancialSummaryController(financialAccountEditor, FinancialAccount) {
    var controller = this;

    controller.addAccountClicked = function() {
      var acct = new FinancialAccount();
      financialAccountEditor.open(acct, 'create');
    };

    controller.addAccountTooltip = {
      title: "Add a new account"
    };
  }
}());