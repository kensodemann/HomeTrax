(function() {
  'use strict';

  angular.module('app.financial').constant('financialRoutes', [{
    path: '/financialSummary',
    templateUrl: 'app/financial/summary/template.html',
    controller: 'financialSummaryController'
  }, {
    path: '/financialDetails/:id',
    templateUrl: 'app/financial/details/template.html',
    controller: 'financialDetailsController'
  }]);
})();