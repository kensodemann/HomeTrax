angular.module('app', ['ngRoute', 'ngResource']);

angular.module('app').config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  
  $routeProvider.when('/', {
    templateUrl: '/partials/main/main',
    controller: 'trxMainCtrl'
  });

  $routeProvider.when('/about', {
    templateUrl: '/partials/main/about',
    controller: 'trxAboutCtrl'
  });

  $routeProvider.when('/calendar',{
    templateUrl: '/partials/calendar/main',
    controller: 'trxCalendarCtrl'
  });

  $routeProvider.when('/finance/account',{
    templateUrl: '/partials/finance/account',
    controller: 'trxFinancialAccountCtrl'
  });
});

angular.module('app').run(function($rootScope, $location) {
  $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
    if (rejection === 'not authorized') {
      $location.path('/');
    }
  });
});