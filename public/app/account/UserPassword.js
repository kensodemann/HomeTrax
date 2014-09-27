angular.module('app').factory('UserPassword', function($resource) {
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