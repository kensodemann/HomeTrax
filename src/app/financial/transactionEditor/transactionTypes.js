(function() {
  'use strict';

  angular.module('app.financial').constant('transactionTypes', [{
    transactionType: 'disbursement',
    name: 'Cash Disbursement'
  }, {
    transactionType: 'payment',
    name: 'Payment'
  }]);
}());
