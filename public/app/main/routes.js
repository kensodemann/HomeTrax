/* global angular */
(function() {
  'use strict';

  angular.module('app').constant('mainRoutes', [{
    path: '/',
    templateUrl: '/partials/main/templates/main',
    controller: 'mainCtrl',
    resolve: {
      authorized: /* @ngInject */ function(authService) {
        return authService.currentUserAuthorizedForRole('');
      }
    }
  }, {
    path: '/about',
    templateUrl: '/partials/main/templates/about',
    controller: 'aboutCtrl'
  }]);
})();