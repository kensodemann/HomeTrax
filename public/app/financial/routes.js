(function() {
  'use strict';

  angular.module('app.financial').constant('financialRoutes', [{
    path: '/financialSummary',
    templateUrl: '/partials/financial/templates/financialSummary',
    controller: 'financialSummaryController',
    resolve: {
      authorized: /* @ngInject */ function(authService) {
        return authService.currentUserAuthorizedForRoute('');
      }
    }
  }]);
})();