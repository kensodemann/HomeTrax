(function() {
  'use strict';

  angular.module('homeTrax.auth.authService', [
    'homeTrax.auth.authToken',
    'homeTrax.auth.identity',
    'homeTrax.common.core.config',
    'homeTrax.common.resources'
  ]).factory('authService', AuthService);

  function AuthService($http, identity, $q, User, config, authToken) {
    return {
      authenticateUser: function(username, password) {
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
      },

      logoutUser: function() {
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
    };
  }
}());