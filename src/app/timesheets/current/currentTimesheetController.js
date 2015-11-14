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

  function CurrentTimesheetController($log, dateUtilities, timesheets, TaskTimer, taskTimerEditor, EditorMode) {
    var controller = this;

    var endDate = dateUtilities.weekEndDate(new Date());
    controller.dates = dateUtilities.generateWeek(endDate);
    controller.timesheet = undefined;
    controller.taskTimers = [];

    controller.editTimer = editTimer;
    controller.newTimer = newTimer;

    activate();

    function editTimer(timer) {
      taskTimerEditor.open(timer, EditorMode.edit);
    }

    function newTimer() {
      var today = getSelectedDay();
      var timer = new TaskTimer({
        timesheetRid: controller.timesheet._id,
        workDate: today.isoDateString
      });
      taskTimerEditor.open(timer, EditorMode.create).result.then(function(tt) {
        controller.taskTimers.push(tt);
      });
    }

    function getSelectedDay() {
      return _.find(controller.dates, function(day) {
        return day.active;
      });
    }

    function activate() {
      selectToday();
      timesheets.getCurrent().then(function(current) {
        controller.timesheet = current;
        controller.taskTimers = TaskTimer.query({
          timesheetRid: current._id
        });
      });
    }

    function selectToday() {
      var today = dateUtilities.removeTimezoneOffset(new Date()).toISOString().substring(0, 10);
      angular.forEach(controller.dates, function(day) {
        day.active = (day.isoDateString === today);
      });
    }
  }
}());
