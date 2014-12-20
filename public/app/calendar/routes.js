/* global angular */
(function() {
  'use strict';

  angular.module('app.calendar').constant('calendarRoutes', [{
    path: '/calendar',
    templateUrl: '/partials/calendar/templates/calendar',
    controller: 'calendarCtrl',
    resolve: {
      authorized: /* @ngInject */ function(authService) {
        return authService.currentUserAuthorizedForRoute('');
      }
    }
  }]);
})();