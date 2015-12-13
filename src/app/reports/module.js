(function() {
  'use strict';

  angular.module('homeTrax.reports', [
    'homeTrax.reports.menu.reportsMenuController',
    'homeTrax.reports.timeReport.timeReportController'
  ]).config(function($stateProvider) {
    $stateProvider.state('app.reports', {
      url: '/reports',
      abstract: true,
      views: {
        mainShell: {
          template: '<ui-view name="reportView"></ui-view>'
        }
      }
    });
  });
}());