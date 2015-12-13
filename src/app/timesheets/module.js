(function() {
  'use strict';

  angular.module('homeTrax.timesheets', [
    'homeTrax.timesheets.list',
    'homeTrax.timesheets.menu',
    'homeTrax.timesheets.view'
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