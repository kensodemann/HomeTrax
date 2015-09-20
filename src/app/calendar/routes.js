/* global angular */
(function() {
  'use strict';

  angular.module('app.calendar').constant('calendarRoutes', [{
    path: '/calendar',
    templateUrl: 'app/calendar/templates/calendar.html',
    controller: 'calendarCtrl'
  }]);
})();