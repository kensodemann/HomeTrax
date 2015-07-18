(function() {
  'use strict';

  angular.module('app.core').factory('HomeAppEvent', HomeAppEvent);

  function HomeAppEvent(HomeAppResource) {
    return new HomeAppResource('events');
  }
}());