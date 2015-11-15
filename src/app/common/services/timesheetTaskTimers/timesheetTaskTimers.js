(function() {
  'use strict';

  angular.module('homeTrax.common.services.timesheetTaskTimers').factory('timesheetTaskTimers', timesheetTaskTimers);

  function timesheetTaskTimers(TaskTimer) {
    var currentTimesheet;

    var service = {
      all: [],

      load: load,
      get: getTaskTimers,
      totalTime: getTotalTime,
      create: newTaskTimer,
      add: addTaskTimer
    };

    return service;

    function load(ts) {
      currentTimesheet = ts;
      service.all = TaskTimer.query({timesheetRid: ts._id});
      return service.all.$promise;
    }

    function getTaskTimers(dt) {
      return _.filter(service.all, function(t) {
        return t.workDate === dt;
      });
    }

    function getTotalTime(dt) {
      var time = 0;
      var taskTimers = (dt ? getTaskTimers(dt) : service.all);

      angular.forEach(taskTimers, function(t) {
        time += t.milliseconds;
      });

      return time;
    }

    function newTaskTimer(dt) {
      return new TaskTimer({
        timesheetRid: currentTimesheet._id,
        workDate: dt
      });
    }

    function addTaskTimer(tt) {
      service.all.push(tt);
    }
  }
}());