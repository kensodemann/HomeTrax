(function() {
  'use strict';

  angular.module('homeTrax.timesheets.list', [
      'ui.router'
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

  function TimesheetListController() {}
}());
