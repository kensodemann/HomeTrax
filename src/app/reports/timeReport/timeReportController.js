(function() {
  'use strict';

  angular.module('homeTrax.reports.timeReport.timeReportController', [
      'ngRoute',
      'homeTrax.common.filters.hoursMinutes',
      'homeTrax.common.services.timesheets',
      'homeTrax.common.services.timesheetTaskTimers',
      'homeTrax.reports.services.timeReportData'
    ])
    .controller('timeReportController', TimeReportController)
    .config(function($routeProvider) {
      $routeProvider.when('/reports/timeReport', {
        templateUrl: 'app/reports/timeReport/timeReport.html',
        controller: 'timeReportController',
        controllerAs: 'controller'
      });
    });

  function TimeReportController($log, timesheets, timesheetTaskTimers, timeReportData) {
    var controller = this;

    controller.timesheet = undefined;

    activate();

    function activate() {
      timesheets.getCurrent().then(initializeTimesheetData, logError);
    }

    function initializeTimesheetData(ts) {
      controller.timesheet = ts;
      timesheetTaskTimers.load(ts).then(summarizeData, logError);
    }

    function summarizeData() {
      controller.summaryData = timeReportData.getSummaryData(timesheetTaskTimers.all);
      controller.dailySummaryData = timeReportData.getDailySummaryData(timesheetTaskTimers.all);
    }

    function logError(res) {
      $log.error(res);
    }
  }
}());