(function() {
  'use strict';

  angular.module('app.account').factory('UserPassword', UserPassword);

  function UserPassword($resource) {
    return $resource('/api/changepassword/:id', {
      id: "@_id"
    }, {
      update: {
        method: 'PUT',
        isArray: false
      }
    });
  }
}());