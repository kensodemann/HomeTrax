(function() {
  'use strict';

  angular.module('homeTrax.timesheets.menu', [
    'homeTrax.auth.identity'
  ]).controller('timesheetsMenuController', TimesheetssMenuController);

  function TimesheetssMenuController(identity) {
    this.identity = identity;
  }
}());