angular.module('app').factory('calendarEvent', ['$resource',
  function($resource) {
    var eventResource = $resource('/api/events/:id', {
      id: "@_id"
    });

    return eventResource;
  }
]);