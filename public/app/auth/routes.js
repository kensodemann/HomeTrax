(function() {
  'use strict';

  angular.module('app.auth').constant('authRoutes', [{
    path: '/login',
    templateUrl: 'app/auth/templates/login.html',
    controller: 'loginCtrl'
  }]);
})();