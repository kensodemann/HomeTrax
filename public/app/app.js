/* global angular */
(function() {
  'use strict';

  angular.module('app', ['app.core', 'app.account', 'app.calendar', 'app.finance', 'ngAnimate', 'ngRoute', 'ngResource']);

  angular.module('app')
    .config(configure)
    .run(runApplication);

  function configure($routeProvider, $locationProvider) {
    var routeRoleChecks = {
      admin: {
        auth: /* @ngInject */function(authService) {
          return authService.currentUserAuthorizedForRoute('admin');
        }
      },
      user: {
        auth: /* @ngInject */function(authService) {
          return authService.currentUserAuthorizedForRoute('');
        }
      }
    };

    $locationProvider.html5Mode(true);

    $routeProvider.when('/', {
      templateUrl: '/partials/main/templates/main',
      controller: 'mainCtrl',
      controllerAs: 'ctrl',
      resolve: routeRoleChecks.user
    });

    $routeProvider.when('/about', {
      templateUrl: '/partials/main/templates/about',
      controller: 'aboutCtrl',
      controllerAs: 'ctrl'
    });

    $routeProvider.when('/calendar', {
      templateUrl: '/partials/calendar/templates/calendar',
      controller: 'calendarCtrl',
      controllerAs: 'ctrl',
      resolve: routeRoleChecks.user
    });

    $routeProvider.when('/login', {
      templateUrl: '/partials/account/templates/login',
      controller: 'loginCtrl',
      controllerAs: 'ctrl'
    });

    $routeProvider.when('/finance/account', {
      templateUrl: '/partials/finance/templates/account',
      controller: 'financialAccountCtrl',
      controllerAs: 'ctrl',
      resolve: routeRoleChecks.user
    });

    $routeProvider.when('/account/userlist', {
      templateUrl: '/partials/account/templates/userList',
      controller: 'userListCtrl',
      controllerAs: 'ctrl',
      resolve: routeRoleChecks.admin
    });

    $routeProvider.when('/account/myprofile', {
      templateUrl: '/partials/account/templates/myProfile',
      controller: 'myProfileCtrl',
      controllerAs: 'ctrl',
      resolve: routeRoleChecks.user
    });
  }

  function runApplication($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
      if (rejection === 'Not Authorized') {
        $location.path('/');
      } else if (rejection === 'Not Logged In') {
        $location.path('/login');
      }
    });
  }
}());