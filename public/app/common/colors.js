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

    function getColor(type, useUserColor) {
      return identity.currentUser.colors[type];
    }

    return exports;
  }
})();