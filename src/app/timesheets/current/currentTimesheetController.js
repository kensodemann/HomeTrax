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

  function CurrentTimesheetController(Timesheet, dateUtilities) {
    var controller = this;

    activate();

    var endDate = dateUtilities.weekEndDate(new Date());
    controller.dates = dateUtilities.generateWeek(endDate);

    controller.tasks = [{
      _id: '88499584',
      sbvbTaskId: 'RFP14141',
      jiraTaskId: 'AA-101',
      name: 'Drink Coffee',
      milliseconds: 4392000,
      isActive: true,
      task: {
        _id: '1234',
        name: 'Drink'
      }
    }, {
      _id: '99488593',
      sbvbTaskId: 'RFP14141',
      jiraTaskId: 'AA-102',
      name: 'Eat Cake',
      milliseconds: 5891000,
      isActive: false,
      task: {
        _id: '1235',
        name: 'Eat'
      }
    }];

    function activate() {
      var weekEndDate = dateUtilities.weekEndDate(new Date()).toJSON().substring(0, 10);
      Timesheet.query({
        endDate: weekEndDate
      }, success, error);

      function success(timesheets) {
        if (timesheets.length === 0) {
          controller.timesheet = new Timesheet({
            endDate: weekEndDate
          });
          controller.timesheet.$save();
        } else {
          controller.timesheet = timesheets[0];
        }
      }

      function error() {}
    }
  }
}());
