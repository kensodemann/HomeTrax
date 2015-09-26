/* global angular */
(function() {
  'use strict';

  angular.module('homeTrax.main').constant('mainRoutes', [{
    path: '/',
    templateUrl: 'app/main/templates/main.html',
    controller: 'mainCtrl'
  }, {
    path: '/about',
    templateUrl: 'app/main/templates/about.html',
    controller: 'aboutCtrl'
  }]);
})();