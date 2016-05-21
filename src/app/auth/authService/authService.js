(function() {
  'use strict';

  angular.module('homeTrax.auth.authService', [
    'homeTrax.auth.authToken',
    'homeTrax.auth.identity',
    'homeTrax.common.core.config',
    'homeTrax.common.resources.User'
  ]).factory('authService', AuthService);

  function AuthService($http, identity, $q, User, config, authToken) {
    return {
      authenticateUser: authenticateUser,
      logoutUser: logoutUser,
      refreshLogin: refreshLogin
    };

    function authenticateUser(username, password) {
      var dfd = $q.defer();
      $http.post(config.dataService + '/login', {
        username: username,
        password: password
      }).then(function(response) {
        if (response.data.success) {
          var u = new User();
          angular.extend(u, response.data.user);
          identity.set(u);
          authToken.set(response.data.token);
          dfd.resolve(true);
        } else {
          authToken.clear();
          dfd.resolve(false);
        }
      });

      return dfd.promise;
    }

    function logoutUser() {
      var dfd = $q.defer();
      $http.post(config.dataService + '/logout', {
        logout: true
      }).then(function() {
        identity.clear();
        dfd.resolve();
      });

      authToken.clear();
      return dfd.promise;
    }

    function refreshLogin() {
      $http.get(config.dataService + '/freshLoginToken').then(function(response) {
        authToken.set(response.data.token);
      });
    }
  }
}());
