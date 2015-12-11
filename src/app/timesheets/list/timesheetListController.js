(function() {
  'use strict';

  angular.module('homeTrax.timesheets.list', [
      'ui.router',
      'homeTrax.common.resources.Timesheet'
    ]).controller('timesheetListController', TimesheetListController)
    .config(function($stateProvider) {
      $stateProvider.state('app.timesheets.list', {
        url: '/list',
        views: {
          timesheetView: {
            templateUrl: 'app/timesheets/list/timesheetList.html',
            controller: 'timesheetListController',
            controllerAs: 'controller'
          }
        }
      });
    });

  function TimesheetListController(Timesheet, messageDialog) {
    this.timesheets = Timesheet.query(noop, displayError);

    function noop() {}

    function displayError(res) {
      messageDialog.error('Error Getting Timesheets', res.data.reason);
    }
  }
}());
