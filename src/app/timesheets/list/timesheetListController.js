(function() {
  'use strict';

  angular.module('homeTrax.timesheets.list')
    .controller('timesheetListController', TimesheetListController)
    .config(function($routeProvider) {
      $routeProvider.when('/timesheets/list', {
        templateUrl: 'app/timesheets/list/timesheetList.html',
        controller: 'timesheetListController',
        controllerAs: 'controller'
      });
    });

  function TimesheetListController() {
  }
}());