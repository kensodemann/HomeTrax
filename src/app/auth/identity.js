(function() {
  'use strict';

  angular.module('homeTrax.auth').factory('identity', Identity);

  function Identity($http, $q, config, authToken, cacheBuster) {
    var exports = {
      get: getCurrentUser,
      set: setCurrentUser,
      clear: clearCurrentUser,

      isAuthenticated: isAuthenticated,
      isAuthorized: isAuthorized
    };

    var currentUser;

    return exports;

    function getCurrentUser() {
      if (!!currentUser) {
        return $q.when(currentUser);
      } else {
        return $http.get(config.dataService + '/currentUser', {params: {_: cacheBuster.value}})
          .then(function(response) {
            currentUser = response.data;
            return response.data;
          });
      }
    }

    function setCurrentUser(user) {
      currentUser = user;
    }

    function clearCurrentUser() {
      currentUser = undefined;
    }

    function isAuthenticated() {
      return !!authToken.get();
    }

    function isAuthorized(role) {
      return isAuthenticated() &&
        (!role || (!!currentUser && !!currentUser.roles && currentUser.roles.indexOf(role) > -1));
    }
  }
}());