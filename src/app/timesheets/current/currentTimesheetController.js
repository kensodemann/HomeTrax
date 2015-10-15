(function() {
  'use strict';

  angular.module('homeTrax.timesheets.current')
    .controller('currentTimesheetController', CurrentTimesheetController)
    .config(function($routeProvider) {
      $routeProvider.when('/timesheets/current', {
        templateUrl: 'app/timesheets/current/currentTimesheet.html',
        controller: 'currentTimesheetController',
        controllerAs: 'controller'
      });
    });

  function CurrentTimesheetController() {
    var controller = this;

    controller.dates = [
      new Date(2015, 9, 18),
      new Date(2015, 9, 19),
      new Date(2015, 9, 20),
      new Date(2015, 9, 21),
      new Date(2015, 9, 22),
      new Date(2015, 9, 23),
      new Date(2015, 9, 24)
    ];
  }
}());