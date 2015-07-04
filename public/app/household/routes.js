/* global angular */
(function() {
  'use strict';

  angular.module('app.household').constant('householdRoutes', [{
    path: '/household',
    templateUrl: 'app/household/templates/household.html',
    controller: 'householdCtrl'
  }]);
}());