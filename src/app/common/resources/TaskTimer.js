(function() {
  'use strict';

  angular.module('homeTrax.common.resources.TaskTimer', [
    'ngResource',
    'homeTrax.common.core.config'
  ]).factory('TaskTimer', TaskTimer);

  function TaskTimer($resource, config) {
    return $resource(config.dataService + '/timesheets/:timesheetRid/taskTimers/:id', {
      id: '@_id',
      timesheetRid: '@timesheetRid'
    });
  }
}());
