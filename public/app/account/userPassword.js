angular.module('app').factory('userPassword', function($resource) {
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