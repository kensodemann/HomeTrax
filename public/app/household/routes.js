/* global angular */
(function() {
  'use strict';

  angular.module('app.household').constant('householdRoutes', [{
    path: '/household',
    templateUrl: '/partials/household/templates/household',
    controller: 'householdCtrl',
    resolve: {
      authorized: /* @ngInject */ function(authService) {
        return authService.currentUserAuthorizedForRole('');
      }
    }
  }]);
}());