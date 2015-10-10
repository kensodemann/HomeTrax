(function() {
  'use strict';

  angular.module('homeTrax.common.resources').factory('User', User);

  function User($resource, config) {
    var UserResource = $resource(config.dataService + '/users/:id', {
      id: '@_id'
    });

    UserResource.prototype.isAdministrator = function() {
      return !!this.roles && this.roles.indexOf('admin') > -1;
    };

    UserResource.prototype.color = '#3a87ad';

    return UserResource;
  }
}());