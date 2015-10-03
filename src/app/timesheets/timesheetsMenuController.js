(function() {
  'use strict';

  angular.module('homeTrax.timesheets').controller('timesheetsMenuController', TimesheetssMenuController);

  function TimesheetssMenuController(identity) {
    this.identity = identity;
  }
}());