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

  function CurrentTimesheetController(dateUtilities, timesheets, TaskTimer) {
    var controller = this;

    var endDate = dateUtilities.weekEndDate(new Date());
    controller.dates = dateUtilities.generateWeek(endDate);

    activate();
    
    function activate() {
      timesheets.getCurrent().then(function(current) {
        controller.timesheet = current;
        controller.tasks = TaskTimer.query({
          timesheetRid: current._id
        });
      });
    }
  }
}());
