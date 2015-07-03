(function() {
  'use strict';

  angular.module('app.auth').constant('authRoutes', [{
    path: '/login',
    templateUrl: '/partials/auth/templates/login',
    controller: 'loginCtrl'
  }]);
})();