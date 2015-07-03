/* global angular */
(function() {
  'use strict';

  angular.module('app.auth').factory('identity', Identity);

  function Identity($http, User, cacheBuster) {
    var exports = {
      currentUser: undefined,
      isAuthenticated: isAuthenticated,
      isAuthorized: isAuthorized
    };

    setCurrentUser();

    return exports;

    function setCurrentUser() {
      $http.get('/api/currentUser', { params: { _: cacheBuster.value } })
        .success(function(data) {
          exports.currentUser = new User();
          angular.extend(exports.currentUser, data);
        });
    }

    function isAuthenticated() {
      return !!exports.currentUser;
    }

    function isAuthorized(role) {
      return isAuthenticated() && (!role || (!!exports.currentUser.roles && exports.currentUser.roles.indexOf(role) > -1));
    }
  }
}());