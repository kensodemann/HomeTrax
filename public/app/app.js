/* global angular */
(function() {
  'use strict';

  angular.module('app', ['app.core', 'app.account', 'app.calendar', 'app.finance', 'ngAnimate', 'ngRoute', 'ngResource']);

  angular.module('app')
    .config(configure)
    .run(runApplication);

  function configure($routeProvider, $locationProvider,
    mainRoutes, accountRoutes, calendarRoutes, financeRoutes) {
    var routeRoleChecks = {
      admin: {
        auth: /* @ngInject */ function(authService) {
          return authService.currentUserAuthorizedForRoute('admin');
        }
      },
      user: {
        auth: /* @ngInject */ function(authService) {
          return authService.currentUserAuthorizedForRoute('');
        }
      }
    };

    $locationProvider.html5Mode(true);

    setupRoutes(mainRoutes);
    setupRoutes(accountRoutes);
    setupRoutes(calendarRoutes);
    setupRoutes(financeRoutes);

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

  function runApplication($rootScope, $location) {
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