(function() {
  'use strict';

  angular.module('app.calendar').factory('EventCategory', EventCategory);

  function EventCategory($resource) {
    return $resource('/api/eventCategories/:id', {
      id: "@_id"
    });
  }
}());

