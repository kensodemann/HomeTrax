(function() {
  'use strict';

  angular.module('app.financial').constant('financialAccountTypes', [{
    accountType: "checking",
    name: "Checking",
    balanceType: "asset"
  }, {
    accountType: "savings",
    name: 'Savings',
    balanceType: "asset"
  }, {
    accountType: "brokerage",
    name: "Investment",
    balanceType: "asset"
  }, {
    accountType: "mortgage",
    name: "Home Mortgage",
    balanceType: "liability"
  }, {
    accountType: "loan",
    name: "Loan",
    balanceType: "liability"
  }]);
}());