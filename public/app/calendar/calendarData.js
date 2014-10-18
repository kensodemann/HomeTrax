'use strict';

angular.module('app').factory('calendarData', ['$q', 'CalendarEvent', 'EventCategory', 'identity',
  function($q, CalendarEvent, EventCategory, identity) {
    var evts;
    var evtCats = [];
    var mineOnly;
    var excludedCategories = [];

    function loadEvents() {
      var dfd = $q.defer();
      evts = CalendarEvent.query({}, function() {
        dfd.resolve(true);
      }, function() {
        dfd.resolve(false);
      });
      return dfd.promise;
    }

    function loadEventCategories() {
      var dfd = $q.defer();
      evtCats = EventCategory.query({}, function() {
        angular.forEach(evtCats, function(cat) {
          cat.include = !(excludedCategories[cat.name]);
        });
        dfd.resolve(true);
      }, function() {
        dfd.resolve(false);
      });
      return dfd.promise;
    }

    return {
      load: function() {
        var dfd = $q.defer();

        $q.all([
          loadEventCategories(),
          loadEvents()
        ]).then(function(data) {
          dfd.resolve(data[0] && data[1]);
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
        return $.grep(evts, function(evt) {
          return (!mineOnly || evt.userId === identity.currentUser._id) && !excludedCategories[evt.category];
        });
      },

      newEvent: function(day) {
        var event = new CalendarEvent();
        event.start = moment(day.hour(8));
        event.end = moment(day.hour(9));
        event.allDay = false;
        return event;
      },

      eventCategories: function() {
        return evtCats;
      }
    };
  }]);