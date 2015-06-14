/* global angular */
(function() {
  'use strict';

  angular.module('app.account').constant('accountRoutes', [{
    path: '/account/myprofile',
    templateUrl: '/partials/account/templates/myProfile',
    controller: 'myProfileCtrl',
    resolve: {
      authorized: /* @ngInject */ function(authService) {
        return authService.currentUserAuthorizedForRole('');
      }
    }
  }, {
    path: '/account/userlist',
    templateUrl: '/partials/account/templates/userList',
    controller: 'userListCtrl',
    resolve: {
      authorized: /* @ngInject */ function(authService) {
        return authService.currentUserAuthorizedForRole('admin');
      }
    }
  }, {
    path: '/login',
    templateUrl: '/partials/account/templates/login',
    controller: 'loginCtrl'
  }]);
})();