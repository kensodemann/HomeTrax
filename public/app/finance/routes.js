/* global angular */
(function() {
  'use strict';

  angular.module('app.finance').constant('financeRoutes', [{
    path: '/finance/account',
    templateUrl: '/partials/finance/templates/account',
    controller: 'financialAccountCtrl',
    resolve: {
      authorized: /* @ngInject */ function(authService) {
        return authService.currentUserAuthorizedForRoute('');
      }
    }
  }]);
})();