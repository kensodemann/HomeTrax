/* global angular */
(function() {
  'use strict';

  angular.module('app.core').factory('colors', ColorService);

  function ColorService(identity) {
    var exports = {
      calendar: 0,
      appointment: 1,
      task: 2,
      anniversary: 3,

      getColor: getColor
    };

    function getColor(type, useSystemColors) {
      var colors;
      if (useSystemColors) {
        colors = [identity.currentUser.colors[0], '#990033', '#669933', '#9933FF'];
      }
      else {
        colors = identity.currentUser.colors;
      }
      return colors[type];
    }

    return exports;
  }
})();