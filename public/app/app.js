angular.module('app', ['ngRoute', 'ngResource']);

angular.module('app')
  .config(function($routeProvider, $locationProvider) {
    var routeRoleChecks = {
      admin: {
        auth: function(trxAuthService) {
          return trxAuthService.currentUserAuthorizedForRoute('admin')
        }
      },
      user: {
        auth: function(trxAuthService) {
          return trxAuthService.currentUserAuthorizedForRoute('')
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

    $routeProvider.when('/account/userlist', {
      templateUrl: '/partials/account/user-list',
      controller: 'trxUserListCtrl',
      resolve: routeRoleChecks.admin
    });

    $routeProvider.when('/account/myprofile', {
      templateUrl: '/partials/account/my-profile',
      controller: 'trxMyProfileCtrl',
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