(function() {
  'use strict';

  angular.module('homeTrax.common.resources')
    .factory('Timesheet', Timesheet);

  function Timesheet($resource, config) {
    return $resource(config.dataService + '/timesheets/:id', {
      id: '@_id'
    });
  }
}());
