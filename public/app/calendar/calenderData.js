'use strict';

angular.module('app').factory('calendarData', ['$q', 'CalendarEvent', 'identity',
  function($q, CalendarEvent, identity) {
    var data;
    var mineOnly;
    var excludedCategories = [];

    return {
      load: function() {
        var dfd = $q.defer();
        data = CalendarEvent.query({}, function() {
          dfd.resolve(true);
        }, function() {
          dfd.resolve(false);
        });
        return dfd.promise;
      },

      limitToMine: function(bool) {
        mineOnly = bool;
      },

      excludeCategory: function(category) {
        excludedCategories[category] = true;
      },

      includeCategory: function(category) {
        excludedCategories[category] = false;
      },

      excludedEvents: function() {
        return $.grep(data, function(evt) {
          return (mineOnly && evt.userId !== identity.currentUser._id) ||
            excludedCategories[evt.category];
        });
      },

      events: function() {
        return $.grep(data, function(evt) {
          return (!mineOnly || evt.userId === identity.currentUser._id) &&
            !excludedCategories[evt.category];
        });
      }
    };
  }]);