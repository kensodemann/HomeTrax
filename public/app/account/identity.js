(function() {
  'use strict';

  angular.module('app.account').factory('identity', Identity);

  function Identity($window, User) {
    var currentUser;

    if (!!$window.bootstrappedUserObject) {
      currentUser = new User();
      angular.extend(currentUser, $window.bootstrappedUserObject);
    }

    return {
      currentUser: currentUser,
      isAuthenticated: function() {
        return !!this.currentUser;
      },
      isAuthorized: function(role) {
        return this.isAuthenticated() && (!role || ( !!this.currentUser.roles && this.currentUser.roles.indexOf(role) > -1));
      }
    };
  }
}());