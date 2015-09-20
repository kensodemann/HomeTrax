(function() {
  'use strict';

  angular.module('app.financial')
    .constant('balanceTypes', {
      asset: 'asset',
      liability: 'liability'
    });
}());
