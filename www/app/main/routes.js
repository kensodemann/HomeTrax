/* global angular */
(function() {
  'use strict';

  angular.module('app').constant('mainRoutes', [{
    path: '/',
    templateUrl: 'app/main/templates/main.html',
    controller: 'mainCtrl'
  }, {
    path: '/about',
    templateUrl: 'app/main/templates/about.html',
    controller: 'aboutCtrl'
  }]);
})();