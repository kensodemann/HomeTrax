(function() {
  'use strict';

  angular.module('app.financial').constant('transactionTypes', [{
    accountType: "disbursement",
    name: "Cash Disbursement"
  }, {
    accountType: "payment",
    name: "Payment"
  }]);
}());
