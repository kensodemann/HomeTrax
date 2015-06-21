/* global angular */
(function() {
  'use strict';

  angular.module('app',
    ['app.core', 'app.account', 'app.calendar', 'app.financial', 'app.household',
      'LocalStorageModule', 'ngAnimate', 'ngRoute', 'ngResource']);

  angular.module('app')
    .config(routes)
    .config(services)
    .run(routeErrorHandling);

  function routes($routeProvider, $locationProvider,
                  mainRoutes, accountRoutes, calendarRoutes, financialRoutes, householdRoutes) {
    $locationProvider.html5Mode(true);

    setupRoutes(mainRoutes);
    setupRoutes(accountRoutes);
    setupRoutes(calendarRoutes);
    setupRoutes(financialRoutes);
    setupRoutes(householdRoutes);

    function setupRoutes(routes) {
      angular.forEach(routes, function(route) {
        createRoute(route);
      });

      function createRoute(route) {
        $routeProvider.when(route.path, {
          templateUrl: route.templateUrl,
          controller: route.controller,
          controllerAs: 'ctrl',
          resolve: route.resolve
        });
      }
    }
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