/* global angular */
(function() {
  'use strict';

  angular.module('homeTrax.auth').factory('identity', Identity);

  function Identity($http, config, authToken, cacheBuster) {
    var exports = {
      currentUser: undefined,
      isAuthenticated: isAuthenticated,
      isAuthorized: isAuthorized
    };

    setCurrentUser();

    return exports;

    function setCurrentUser() {
      $http.get(config.dataService + '/currentUser', { params: { _: cacheBuster.value } })
        .success(function(data) {
          exports.currentUser =  data;
        });
    }

    function isAuthenticated() {
      return !!authToken.get();
    }

    function isAuthorized(role) {
      return isAuthenticated() &&
        (!role || (!! exports.currentUser && !!exports.currentUser.roles && exports.currentUser.roles.indexOf(role) > -1));
    }
  }
}());