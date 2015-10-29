(function() {
  'use strict';

  angular.module('homeTrax.auth').factory('identity', Identity);

  function Identity($http, $q, config, authToken, cacheBuster) {
    var service = {
      currentUser: undefined,

      get: getCurrentUser,
      set: setCurrentUser,
      clear: clearCurrentUser,

      isAuthenticated: isAuthenticated,
      isAuthorized: isAuthorized
    };

    service.get();

    return service;

    function getCurrentUser() {
      if (service.currentUser) {
        return $q.when(service.currentUser);
      } else {
        return $http.get(config.dataService + '/currentUser', {params: {_: cacheBuster.value}})
          .then(function(response) {
            service.currentUser = response.data;
            return response.data;
          });
      }
    }

    function setCurrentUser(user) {
      service.currentUser = user;
    }

    function clearCurrentUser() {
      service.currentUser = undefined;
    }

    function isAuthenticated() {
      return !!authToken.get();
    }

    function isAuthorized(role) {
      return isAuthenticated() &&
        (!role || (!!service.currentUser && !!service.currentUser.roles && service.currentUser.roles.indexOf(role) > -1));
    }
  }
}());
