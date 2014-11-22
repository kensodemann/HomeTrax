angular.module('app').factory('CalendarEvent', ['$resource',
  function($resource) {
    var eventResource = $resource('/api/events/:id', {
      id: "@_id"
    });

    return eventResource;
  }
]);