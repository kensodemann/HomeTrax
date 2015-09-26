/* global angular */
(function() {
  'use strict';

  angular.module('homeTrax.common.resources').factory('User', User);

  function User($resource, config) {
    var UserResource = $resource(config.dataService + '/users/:id', {
      id: '@_id'
    }, {
      update: {
        method: 'PUT',
        isArray: false
      }
    });

    // TODO: this is nice, but look at getting rid of it.  Leave it in for now
    //       as an example of adding a method.
    UserResource.prototype.isAdmin = function() {
      return this.roles && this.roles.indexOf('admin') > -1;
    };

    UserResource.prototype.color = '#3a87ad';

    return UserResource;
  }
}());