/* global angular */
(function() {
  'use strict';

  angular.module('app.core').factory('colors', ColorService);

  function ColorService() {
    var exports = {
      calendar: 0,
      appointment: 1,
      task: 2,
      anniversary: 3,

      getColor: getColor
    };

    function getColor() {
      return "#FFFFFF";
    }

    return exports;
  }
})();