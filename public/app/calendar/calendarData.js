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

      events: function() {
        return $.grep(data, function(evt) {
          return (!mineOnly || evt.userId === identity.currentUser._id) && !excludedCategories[evt.category];
        });
      },

      newEvent: function(day) {
        var event = new CalendarEvent();
        event.start = moment(day.hour(8));
        event.end = moment(day.hour(9));
        event.allDay = false;
        return event;
      }
    };
  }]);