(function() {
  'use strict';

  angular.module('app').factory('CalendarEvent', CalendarEvent);

  function CalendarEvent($resource) {
    return $resource('/api/events/:id', {
      id: "@_id"
    });
  }
}());