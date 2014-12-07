(function() {
  'use strict';

  angular.module('app.calendar').factory('CalendarEvent', CalendarEvent);

  function CalendarEvent($resource) {
    return $resource('/api/events/:id', {
      id: "@_id"
    });
  }
}());