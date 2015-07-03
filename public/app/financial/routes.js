(function() {
  'use strict';

  angular.module('app.financial').constant('financialRoutes', [{
    path: '/financialSummary',
    templateUrl: '/partials/financial/summary/template',
    controller: 'financialSummaryController'
  }, {
    path: '/financialDetails/:id',
    templateUrl: '/partials/financial/details/template',
    controller: 'financialDetailsController'
  }]);
})();