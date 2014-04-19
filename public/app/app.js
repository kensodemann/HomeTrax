angular.module('app', ['ngRoute', 'ngResource']);

angular.module('app')
  .config(function($routeProvider, $locationProvider) {
    var routeRoleChecks = {
      admin: {
        auth: function(trxAuthentication) {
          return trxAuthentication.currentUserAuthorizedForRoute('admin')
        }
      },
      user: {
        auth: function(trxAuthentication) {
          return trxAuthentication.currentUserAuthorizedForRoute('')
        }
      },
    }

    $locationProvider.html5Mode(true);

    $routeProvider.when('/', {
      templateUrl: '/partials/main/main',
      controller: 'trxMainCtrl',
      resolve: routeRoleChecks.user
    });

    $routeProvider.when('/about', {
      templateUrl: '/partials/main/about',
      controller: 'trxAboutCtrl'
    });

    $routeProvider.when('/calendar', {
      templateUrl: '/partials/calendar/main',
      controller: 'trxCalendarCtrl',
      resolve: routeRoleChecks.user
    });

    $routeProvider.when('/login', {
      templateUrl: '/partials/account/login',
      controller: 'trxLoginCtrl'
    });

    $routeProvider.when('/finance/account', {
      templateUrl: '/partials/finance/account',
      controller: 'trxFinancialAccountCtrl',
      resolve: routeRoleChecks.admin
    });
  });

angular.module('app').run(function($rootScope, $location) {
  $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
    if (rejection === 'Not Authorized') {
      $location.path('/');
    } else if (rejection === 'Not Logged In') {
      $location.path('/login');
    }
  });
});