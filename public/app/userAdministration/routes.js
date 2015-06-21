(function() {
  'use strict';

  angular.module('app.auth').constant('userAdministrationRoutes', [{
    path: '/userAdministration/myprofile',
    templateUrl: '/partials/userAdministration/templates/myProfile',
    controller: 'myProfileCtrl',
    resolve: {
      authorized: /* @ngInject */ function(authService) {
        return authService.currentUserAuthorizedForRole('');
      }
    }
  }, {
    path: '/userAdministration/userlist',
    templateUrl: '/partials/userAdministration/templates/userList',
    controller: 'userListCtrl',
    resolve: {
      authorized: /* @ngInject */ function(authService) {
        return authService.currentUserAuthorizedForRole('admin');
      }
    }
  }]);
})();