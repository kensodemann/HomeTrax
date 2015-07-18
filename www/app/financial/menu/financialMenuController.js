(function() {
  'use strict';

  angular.module('app.financial').controller('financialMenuController', FinancialMenuController);

  function FinancialMenuController(identity) {
    var controller = this;
    controller.identity = identity;
  }
}());