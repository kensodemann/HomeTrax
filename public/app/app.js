/* global angular */
(function() {
  'use strict';

  angular.module('app',
    ['app.core', 'app.auth', 'app.calendar', 'app.financial', 'app.household', 'app.userAdministration',
      'LocalStorageModule', 'ngAnimate', 'ngRoute', 'ngResource']);

  angular.module('app')
    .config(auth)
    .config(routes)
    .config(services)
    .run(routeErrorHandling);

  function routes($routeProvider, $locationProvider,
                  mainRoutes, authRoutes, calendarRoutes, financialRoutes, householdRoutes, userAdministrationRoutes) {
    $locationProvider.html5Mode(true);

    setupRoutes(mainRoutes);
    setupRoutes(authRoutes);
    setupRoutes(calendarRoutes);
    setupRoutes(financialRoutes);
    setupRoutes(householdRoutes);
    setupRoutes(userAdministrationRoutes);

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