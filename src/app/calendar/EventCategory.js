(function() {
  'use strict';

  angular.module('app.calendar').factory('EventCategory', EventCategory);

  function EventCategory(HomeAppResource) {
    return new HomeAppResource('eventCategories');
  }
}());

