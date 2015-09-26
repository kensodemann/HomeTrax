(function() {
  'use strict';

  angular.module('homeTrax.auth').constant('userAdministrationRoutes', [{
    path: '/userAdministration/myprofile',
    templateUrl: 'app/userAdministration/templates/myProfile.html',
    controller: 'myProfileController'
  }, {
    path: '/userAdministration/userlist',
    templateUrl: 'app/userAdministration/templates/userList.html',
    controller: 'userListController'
  }]);
})();