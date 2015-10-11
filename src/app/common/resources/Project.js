(function() {
  'use strict';

  angular.module('homeTrax.common.resources').factory('Project', Project);

  function Project($resource, config) {
    return $resource(config.dataService + '/projects/:id', {
      id: '@_id'
    });
  }
}());