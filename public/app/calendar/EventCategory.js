(function() {
  'use strict';

  angular.module('app').factory('EventCategory', EventCategory);

  function EventCategory($resource) {
    return $resource('/api/eventCategories/:id', {
      id: "@_id"
    });
  }
}());

