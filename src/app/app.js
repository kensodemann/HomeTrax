/* global angular */
(function() {
  'use strict';

  angular.module('homeTrax', [
    'homeTrax.about',
    'homeTrax.auth.authInterceptor',
    'homeTrax.auth.authService',
    'homeTrax.auth.login',
    'homeTrax.main',
    'homeTrax.projects',
    'homeTrax.reports',
    'homeTrax.timesheets',
    'homeTrax.userAdministration',
    'LocalStorageModule'
  ]);

  angular.module('homeTrax')
    .config(auth)
    .config(routes)
    .config(services)
    .config(shell)
    .run(refreshLogin)
    .run(routeErrorHandling);

  function routes($locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);
    // all unknown routes: point back to top level, this could go to an error or 404 style page.
    $urlRouterProvider.otherwise('/');
  }

  function auth($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }

  function refreshLogin($interval, authService) {
    var twentyMinutes = 20 * 60 * 1000;
    authService.refreshLogin();
    $interval(authService.refreshLogin, twentyMinutes);
  }

  function services(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('HomeTrax');
  }

  function shell($stateProvider) {
    $stateProvider.state('app', {
      abstract: true,
      template: '<ui-view name="mainShell"></ui-view>'
    });
  }

  function routeErrorHandling($log, $rootScope, $state) {
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      $log.error('$stateChangeError');
      $log.error(toState);
      $log.error(error);
      $state.go('login');
      $state.get('login').targetState = toState.title;
    });
  }
}());
