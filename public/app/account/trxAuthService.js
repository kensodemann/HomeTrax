angular.module('app').factory('trxAuthService', function($http, trxIdentity, $q, trxUser) {
  return {
    authenticateUser: function(username, password) {
      var dfd = $q.defer();
      $http.post('/login', {
        username: username,
        password: password
      }).then(function(response) {
        if (response.data.success) {
          var user = new trxUser();
          angular.extend(user, response.data.user);
          trxIdentity.currentUser = user;
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
        trxIdentity.currentUser = undefined;
        dfd.resolve();
      });
      return dfd.promise;
    },

    currentUserAuthorizedForRoute: function(role) {
      if (!trxIdentity.isAuthenticated()) {
        return $q.reject('Not Logged In');
      } else if (role !== '' && !trxIdentity.isAuthorized(role)) {
        return $q.reject('Not Authorized');
      } else {
        return true;
      }
    }
  }
})