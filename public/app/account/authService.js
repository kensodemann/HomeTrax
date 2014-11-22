(function() {
  'use strict';

  angular.module('app').factory('authService', AuthService);

  function AuthService($http, identity, $q, User) {
    return {
      authenticateUser: function(username, password) {
        var dfd = $q.defer();
        $http.post('/login', {
          username: username,
          password: password
        }).then(function(response) {
          if (response.data.success) {
            var u = new User();
            angular.extend(u, response.data.user);
            identity.currentUser = u;
            dfd.resolve(true);
          } else {
            dfd.resolve(false);
          }
        });
        return dfd.promise;
      },

      logoutUser: function() {
        var dfd = $q.defer();
        $http.post('/logout', {
          logout: true
        }).then(function() {
          identity.currentUser = undefined;
          dfd.resolve();
        });
        return dfd.promise;
      },

      currentUserAuthorizedForRoute: function(role) {
        if (!identity.isAuthenticated()) {
          return $q.reject('Not Logged In');
        } else if (role !== '' && !identity.isAuthorized(role)) {
          return $q.reject('Not Authorized');
        } else {
          return true;
        }
      }
    };
  }
}());