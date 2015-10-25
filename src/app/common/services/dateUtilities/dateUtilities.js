(function() {
  'use strict';

  angular.module('homeTrax.common.services.dateUtilities')
    .factory('dateUtilities', DateUtilities);

  function DateUtilities() {
    var millisecondsPerMinute = 60000;

    return {
      removeTimezoneOffset: removeTimezoneOffset,
      addTimezoneOffset: addTimezoneOffset,
      generateWeek: generateWeek
    };

    function removeTimezoneOffset(d) {
      var minutesFromUTC = d.getTimezoneOffset();
      return new Date(d.getTime() - (minutesFromUTC * millisecondsPerMinute));
    }

    function addTimezoneOffset(d) {
      var minutesFromUTC = d.getTimezoneOffset();
      return new Date(d.getTime() + (minutesFromUTC * millisecondsPerMinute));
    }

    function generateWeek(d) {
      var days = [];
      var offset = (moment(d).isoWeekday() === 7 ? 7 : 0);

      for (var i = 0; i < 7; i++) {
        var dt = moment(d).isoWeekday(i + offset);
        days.push({
          date: dt.toDate(),
          isoDateString: dt.toISOString().substring(0, 10)
        });
      }

      return days;
    }
  }
}());
