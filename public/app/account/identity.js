/* global angular */
(function() {
  'use strict';

  angular.module('app.account').factory('identity', Identity);

  function Identity($window, User) {
    var exports = {
      currentUser: undefined,
      isAuthenticated: isAuthenticated,
      isAuthorized: isAuthorized
    };

    setCurrentUser();

    return exports;

    function setCurrentUser() {
      exports.currentUser = new User();
      if (!!$window.bootstrappedUserObject) {
        angular.extend(exports.currentUser, $window.bootstrappedUserObject);
      }
    }

    function isAuthenticated() {
      return !!exports.currentUser;
    }

    function isAuthorized(role) {
      return isAuthenticated() && (!role || (!!exports.currentUser.roles && exports.currentUser.roles.indexOf(role) > -1));
    }
  }
}());