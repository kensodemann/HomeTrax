(function() {
  'use strict';

  angular.module('app').controller('calendarMenuCtrl', CalendarMenuCtrl);

  function CalendarMenuCtrl(identity) {
    this.identity = identity;
  }
}());