(function() {
  'use strict';

  angular.module('homeTrax.common.resources').factory('UserPassword', UserPassword);

  function UserPassword($resource, config) {
    return $resource(config.dataService + '/users/:id/password', {
      id: '@_id'
    });
  }
}());