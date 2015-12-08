(function() {
  'use strict';

  angular.module('homeTrax.timesheets', [
    'homeTrax.timesheets.current',
    'homeTrax.timesheets.list',
    'homeTrax.timesheets.menu'
  ]).config(function($stateProvider) {
    $stateProvider.state('app.timesheets', {
      url: '/timesheets',
      abstract: true,
      views: {
        mainShell: {
          template: '<ui-view name="timesheetView"></ui-view>'
        }
      }
    });
  });
}());