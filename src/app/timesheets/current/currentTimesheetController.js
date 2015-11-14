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

  function CurrentTimesheetController($q, dateUtilities, timesheets, TaskTimer, taskTimerEditor, EditorMode) {
    var controller = this;

    controller.dates = [];
    controller.currentDate = '';
    controller.timesheet = undefined;
    controller.allTaskTimers = [];
    controller.taskTimers = [];
    controller.totalTime = 0;
    controller.isReady = false;

    controller.selectDate = selectDate;
    controller.editTimer = editTimer;
    controller.newTimer = newTimer;

    activate();

    function selectDate(idx) {
      if (controller.isReady) {
        controller.currentDate = controller.dates[idx].isoDateString;

        refreshCurrentDate();
      }
    }

    function editTimer(timer) {
      taskTimerEditor.open(timer, EditorMode.edit);
    }

    function newTimer() {
      var timer = new TaskTimer({
        timesheetRid: controller.timesheet._id,
        workDate: controller.currentDate
      });
      taskTimerEditor.open(timer, EditorMode.create).result.then(function(tt) {
        controller.allTaskTimers.push(tt);
        refreshCurrentDate();
      });
    }

    function activate() {
      var today = dateUtilities.removeTimezoneOffset(new Date());
      generateWeek(today);
      selectDay(today);
      loadData().then(function() {
        controller.isReady = true;
        refreshCurrentDate();
      });
    }

    function generateWeek(day) {
      var endDate = dateUtilities.weekEndDate(day);
      controller.dates = dateUtilities.generateWeek(endDate);
    }

    function selectDay(day) {
      controller.currentDate = day.toISOString().substring(0, 10);
      angular.forEach(controller.dates, function(day) {
        day.active = (day.isoDateString === controller.currentDate);
      });
    }

    function loadData() {
      var dfd = $q.defer();

      timesheets.getCurrent().then(getTaskTimers, dfd.reject);
      return dfd.promise;

      function getTaskTimers(currentTimesheet) {
        controller.timesheet = currentTimesheet;
        controller.allTaskTimers = TaskTimer.query({
          timesheetRid: currentTimesheet._id
        }, dfd.resolve, dfd.reject);
      }
    }

    function refreshCurrentDate() {
      selectCurrentDateTimers();
      calculateTimeForCurrentDate();
    }

    function selectCurrentDateTimers() {
      controller.taskTimers = _.filter(controller.allTaskTimers, function(timer) {
        return timer.workDate === controller.currentDate;
      });
    }

    function calculateTimeForCurrentDate() {
      controller.totalTime = 0;
      angular.forEach(controller.taskTimers, function(timer) {
        controller.totalTime += timer.milliseconds;
      });
    }
  }
}());
