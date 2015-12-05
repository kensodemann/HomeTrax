(function() {
  'use strict';

  angular.module('homeTrax.reports.services.timeReportData', [
    'homeTrax.common.resources.TaskTimer',
    'homeTrax.common.resources.Timesheet'
  ]).factory('timeReportData', timeReportData);

  var forEach = angular.forEach;

  function timeReportData($q, Timesheet, TaskTimer) {
    var timesheet;
    var taskTimers;

    return {
      load: load,
      getSummaryData: getSummaryData,
      getDailySummaryData: getDailySummaryData
    };

    function load(id) {
      timesheet = Timesheet.get({id: 42});
      taskTimers = TaskTimer.query({timesheetRid: id});

      return $q.all([
        timesheet.$promise,
        taskTimers.$promise
      ]);
    }

    function getSummaryData() {
      return {
        totalTime: sum(taskTimers),
        jiraTasks: summarizedJiraTasks(taskTimers),
        sbvbTasks: summarizedSbvbTasks(taskTimers)
      };
    }

    function getDailySummaryData() {
      var tasksByDate = _.groupBy(taskTimers, function(timer) {
        return timer.workDate;
      });

      var dates = [];
      var keys = _.keys(tasksByDate).sort();
      forEach(keys, function(key) {
        dates.push({
          date: key,
          jiraTasks: summarizedJiraTasks(tasksByDate[key]),
          sbvbTasks: summarizedSbvbTasks(tasksByDate[key])
        });
      });

      return dates;
    }

    function summarizedJiraTasks(tasks) {
      var jiraTasks = _.groupBy(tasks, function(timer) {
        return timer.project.jiraTaskId || 'Unclassified';
      });

      return summarize(jiraTasks);
    }

    function summarizedSbvbTasks(tasks) {
      var sbvbTasks = _.groupBy(tasks, function(timer) {
        return (timer.project.sbvbTaskId ? (timer.project.sbvbTaskId + ' ' + timer.stage.name) : 'Unclassified');
      });

      return summarize(sbvbTasks);
    }

    function summarize(tasks) {
      var summarizedTasks = [];
      var keys = _.keys(tasks).sort(unclassifiedLast);
      forEach(keys, function(key) {
        summarizedTasks.push({
          project: tasks[key][0].project,
          stage: tasks[key][0].stage,
          totalTime: sum(tasks[key])
        });
      });

      return summarizedTasks;
    }

    function sum(items) {
      var x = 0;
      forEach(items, function(item) {
        x += (item.milliseconds || 0);
      });

      return x;
    }

    function unclassifiedLast(a, b) {
      if (a === 'Unclassified') {
        return 1;
      }

      if (b === 'Unclassified') {
        return -1;
      }

      if (a < b) {
        return -1;
      }

      if (a > b) {
        return 1;
      }

      return 0;
    }
  }
}());