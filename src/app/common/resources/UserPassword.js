(function() {
  'use strict';

  angular.module('homeTrax.common.resources').factory('UserPassword', UserPassword);

  function UserPassword($resource, config) {
    return $resource(config.dataService + '/changepassword/:id', {
      id: '@_id'
    }, {
      update: {
        method: 'PUT',
        isArray: false
      }
    });
  }
}());