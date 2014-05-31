angular.module('app').factory('trxUserPassword', function($resource) {
  var UserResource = $resource('/api/changepassword/:id', {
    id: "@_id"
  }, {
    update: {
      method: 'PUT',
      isArray: false
    }
  });

  return UserResource;
});