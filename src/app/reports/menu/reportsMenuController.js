(function() {
  'use strict';

  angular.module('homeTrax.reports.menu.reportsMenuController', [
    'homeTrax.auth.identity'
  ]).controller('reportsMenuController', ReportsMenuController);

  function ReportsMenuController(identity) {
    this.identity = identity;
  }
}());