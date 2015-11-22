/* global angular */
(function() {
  'use strict';

  angular.module('homeTrax', [
    'homeTrax.about',
    'homeTrax.auth.authInterceptor',
    'homeTrax.auth.login',
    'homeTrax.main',
    'homeTrax.projects',
    'homeTrax.timesheets',
    'homeTrax.userAdministration',
    'LocalStorageModule'
  ]);

  angular.module('homeTrax')
      .config(auth)
      .config(routes)
      .config(services)
      .run(routeErrorHandling);

  function routes($locationProvider) {
    $locationProvider.html5Mode(true);
  }

  function auth($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }

  function services(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('HomeTrax');
  }

  function routeErrorHandling($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
      if (rejection === 'Not Authorized') {
        $location.path('/');
      }
      else if (rejection === 'Not Logged In') {
        $location.path('/login');
      }
    });
  }
}());