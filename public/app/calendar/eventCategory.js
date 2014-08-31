angular.module('app').factory('eventCategory', ['$resource',
  function($resource) {
    var resource = $resource('/api/eventCategories/:id', {
      id: "@_id"
    });

    return resource;
  }
]);