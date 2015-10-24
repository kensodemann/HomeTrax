(function() {
  'use strict';

  angular.module('homeTrax.common.resources')
    .factory('TaskTimer', TaskTimer);

  function TaskTimer($resource, config) {
    return $resource(config.dataService + '/taskTimers/:id', {
      id: '@_id'
    });
  }
}());
