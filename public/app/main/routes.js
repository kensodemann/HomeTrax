/* global angular */
(function() {
  'use strict';

  angular.module('app').constant('mainRoutes', [{
    path: '/',
    templateUrl: '/partials/main/templates/main',
    controller: 'mainCtrl'
  }, {
    path: '/about',
    templateUrl: '/partials/main/templates/about',
    controller: 'aboutCtrl'
  }]);
})();