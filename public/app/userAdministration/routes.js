(function() {
  'use strict';

  angular.module('app.auth').constant('userAdministrationRoutes', [{
    path: '/userAdministration/myprofile',
    templateUrl: '/partials/userAdministration/templates/myProfile',
    controller: 'myProfileCtrl'
  }, {
    path: '/userAdministration/userlist',
    templateUrl: '/partials/userAdministration/templates/userList',
    controller: 'userListCtrl'
  }]);
})();