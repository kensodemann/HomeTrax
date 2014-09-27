angular.module('app').factory('EventCategory', ['$resource',
  function($resource) {
    var resource = $resource('/api/eventCategories/:id', {
      id: "@_id"
    });

    return resource;
  }
]);