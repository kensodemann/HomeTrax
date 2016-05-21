(function() {
  'use strict';

  angular.module('homeTrax.timesheets.view', [
    'ui.router',
    'homeTrax.common.core.EditorMode',
    'homeTrax.common.directives.htTaskTimer',
    'homeTrax.common.filters.hoursMinutes',
    'homeTrax.common.services.dateUtilities',
    'homeTrax.common.services.messageDialog',
    'homeTrax.common.services.timesheets',
    'homeTrax.common.services.timesheetTaskTimers',
    'homeTrax.taskTimers.edit.taskTimerEditor'
  ]).controller('viewTimesheetController', ViewTimesheetController)
    .config(function($stateProvider) {
      $stateProvider
        .state('app.timesheets.viewCurrent', {
          url: '/view',
          views: {
            timesheetView: {
              templateUrl: 'app/timesheets/view/viewTimesheet.html',
              controller: 'viewTimesheetController',
              controllerAs: 'controller'
            }
          }
        })
        .state('app.timesheets.view', {
          url: '/view/:id',
          views: {
            timesheetView: {
              templateUrl: 'app/timesheets/view/viewTimesheet.html',
              controller: 'viewTimesheetController',
              controllerAs: 'controller'
            }
          }
        });
    });

  function ViewTimesheetController($q, $interval, $stateParams, dateUtilities, timesheets,
    timesheetTaskTimers, taskTimerEditor, EditorMode, messageDialog) {
    var controller = this;

    controller.dates = [];
    controller.currentDate = '';
    controller.timesheet = undefined;
    controller.taskTimers = [];
    controller.totalTime = 0;
    controller.isReady = false;

    controller.selectDate = selectDate;
    controller.editTimer = editTimer;
    controller.newTimer = newTimer;

    controller.startTimer = function(timer) {
      timesheetTaskTimers.start(timer).$promise.then(refreshCurrentDate);
    };

    controller.stopTimer = function(timer) {
      timesheetTaskTimers.stop(timer).$promise.then(refreshCurrentDate);
    };

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
      var timer = timesheetTaskTimers.create(controller.currentDate);
      taskTimerEditor.open(timer, EditorMode.create).result.then(function(tt) {
        timesheetTaskTimers.add(tt);
        refreshCurrentDate();
      });
    }

    function activate() {
      var today = dateUtilities.removeTimezoneOffset(new Date());
      loadTimesheet().then(finishActivation, displayError);

      function finishActivation() {
        generateWeek();
        selectDay(today);
        refreshCurrentDate().then(function() {
          controller.isReady = true;
        });

        $interval(refreshCurrentDate, 15000);
      }

      function displayError(res) {
        messageDialog.error('Error', res.data.reason);
      }
    }

    function loadTimesheet() {
      return getTimesheet().then(function(ts) {
        controller.timesheet = ts;
      });

      function getTimesheet() {
        if ($stateParams.id) {
          return timesheets.get($stateParams.id);
        } else {
          return timesheets.getCurrent();
        }
      }
    }

    function generateWeek() {
      controller.dates = dateUtilities.generateWeek(controller.timesheet.endDate);
    }

    function selectDay(day) {
      controller.currentDate =
        $stateParams.id ? controller.dates[0].isoDateString : day.toISOString().substring(0, 10);
      angular.forEach(controller.dates, function(day) {
        day.active = (day.isoDateString === controller.currentDate);
      });
    }

    function refreshCurrentDate() {
      return timesheetTaskTimers.load(controller.timesheet).then(function() {
        controller.taskTimers = timesheetTaskTimers.get(controller.currentDate);
        controller.totalTime = timesheetTaskTimers.totalTime(controller.currentDate);
      });
    }
  }
}());
