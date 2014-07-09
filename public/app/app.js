angular.module('app', ['ngRoute', 'ngResource', 'ui.calendar']);

angular.module('app')
  .config(function($routeProvider, $locationProvider) {
    var routeRoleChecks = {
      admin: {
        auth: function(authService) {
          return authService.currentUserAuthorizedForRoute('admin')
        }
      },
      user: {
        auth: function(authService) {
          return authService.currentUserAuthorizedForRoute('')
        }
      },
    }

    $locationProvider.html5Mode(true);

    $routeProvider.when('/', {
      templateUrl: '/partials/main/main',
      controller: 'mainCtrl',
      resolve: routeRoleChecks.user
    });

    $routeProvider.when('/about', {
      templateUrl: '/partials/main/about',
      controller: 'aboutCtrl'
    });

    $routeProvider.when('/calendar', {
      templateUrl: '/partials/calendar/calendar',
      controller: 'calendarCtrl',
      resolve: routeRoleChecks.user
    });

    $routeProvider.when('/login', {
      templateUrl: '/partials/account/login',
      controller: 'loginCtrl'
    });

    $routeProvider.when('/finance/account', {
      templateUrl: '/partials/finance/account',
      controller: 'financialAccountCtrl',
      resolve: routeRoleChecks.user
    });

    $routeProvider.when('/account/userlist', {
      templateUrl: '/partials/account/userList',
      controller: 'userListCtrl',
      resolve: routeRoleChecks.admin
    });

    $routeProvider.when('/account/myprofile', {
      templateUrl: '/partials/account/myProfile',
      controller: 'myProfileCtrl',
      resolve: routeRoleChecks.user
    });
  });

angular.module('app').directive('modal', function() {
  return {
    restrict: 'C',
    controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
      $scope.$watch($attrs.trigger, function(newValue, oldValue) {
        if (!!newValue && !oldValue) {
          $element.modal('show');
        }
        if (!!oldValue && !newValue) {
          $element.modal('hide');
        }
      });
    }]
  };
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