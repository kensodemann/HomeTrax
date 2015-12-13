(function() {
  'use strict';

  angular.module('homeTrax.reports.timeReport.timeReportController', [
      'ui.router',
      'homeTrax.common.filters.hoursMinutes',
      'homeTrax.common.services.messageDialog',
      'homeTrax.common.services.timesheets',
      'homeTrax.common.services.timesheetTaskTimers',
      'homeTrax.reports.services.timeReportData'
    ])
    .controller('timeReportController', TimeReportController)
    .config(function($stateProvider) {
      $stateProvider.state('app.reports.timeReport', {
        url: '/timeReport',
        views: {
          reportView: {
            templateUrl: 'app/reports/timeReport/timeReport.html',
            controller: 'timeReportController',
            controllerAs: 'controller'
          }
        }
      });
    });

  function TimeReportController($log, timesheets, timesheetTaskTimers,
    timeReportData, messageDialog) {
    var controller = this;

    controller.timesheet = undefined;

    activate();

    function activate() {
      timesheets.getCurrent().then(initializeTimesheetData, displayError);
    }

    function initializeTimesheetData(ts) {
      controller.timesheet = ts;
      timesheetTaskTimers.load(ts).then(summarizeData, displayError);
    }

    function summarizeData() {
      controller.summaryData = timeReportData.getSummaryData(timesheetTaskTimers.all);
      controller.dailySummaryData = timeReportData.getDailySummaryData(timesheetTaskTimers.all);
    }

    function displayError(res) {
      $log.error(res);
      messageDialog.error('Error', res.data.reason);
    }
  }
}());