(function() {
  'use strict';

  angular.module('homeTrax.reports.timeReport.timeReportController', [
      'ngRoute'
  ])
    .controller('timeReportController', TimeReportController)
    .config(function($routeProvider) {
      $routeProvider.when('/reports/timeReport', {
        templateUrl: 'app/reports/timeReport/timeReport.html',
        controller: 'timeReportController',
        controllerAs: 'controller'
      });
    });

  function TimeReportController() {
  }
}());