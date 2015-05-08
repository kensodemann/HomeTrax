(function() {
  'use strict';

  angular.module('app.core').factory('HomeAppEvent', HomeAppEvent);

  function HomeAppEvent($resource) {
    return $resource('/api/events/:id', {
      id: "@_id"
    });
  }
}());