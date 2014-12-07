(function() {
  'use strict';

  angular.module('app.calendar').controller('calendarMenuCtrl', CalendarMenuCtrl);

  function CalendarMenuCtrl(identity) {
    this.identity = identity;
  }
}());