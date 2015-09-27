(function() {
  'use strict';

  angular.module('homeTrax.auth').constant('authRoutes', [{
    path: '/login',
    templateUrl: 'app/auth/templates/login.html',
    controller: 'loginController'
  }]);
})();