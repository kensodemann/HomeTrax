(function() {
  'use strict';

  angular.module('homeTrax.common.resources').factory('Stage', Stage);

  function Stage($resource, config) {
    return $resource(config.dataService + '/stages');
  }
}());
