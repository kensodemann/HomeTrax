(function() {
  'use strict';

  angular.module('app.financial').controller('financialDetailsController', FinancialDetailsController);

  function FinancialDetailsController($routeParams) {
    var controller = {
      activate: function(){
        controller.passedId = $routeParams.id;
      }
    };

    controller.activate();

    return controller;
  }
}());
  