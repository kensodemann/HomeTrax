(function() {
  'use strict';

  angular.module('app.core')
    .factory('dateUtilities', DateUtilities);

  function DateUtilities() {
    var millisecondsPerMinute = 60000;

    return {
      removeTimezoneOffset: function(d) {
        var minutesFromUTC = d.getTimezoneOffset();
        return new Date(d.getTime() - (minutesFromUTC * millisecondsPerMinute));
      },
      addTimezoneOffset: function(d) {
        var minutesFromUTC = d.getTimezoneOffset();
        return new Date(d.getTime() + (minutesFromUTC * millisecondsPerMinute));
      }
    };
  }
}());