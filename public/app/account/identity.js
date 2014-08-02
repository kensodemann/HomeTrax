angular.module('app').factory('identity', function($window, user) {
  var currentUser;

  if ( !! $window.bootstrappedUserObject) {
    currentUser = new user();
    angular.extend(currentUser, $window.bootstrappedUserObject);
  }

  return {
    currentUser: currentUser,
    isAuthenticated: function() {
      return !!this.currentUser;
    },
    isAuthorized: function(role) {
      return this.isAuthenticated() && (!role || ( !! this.currentUser.roles && this.currentUser.roles.indexOf(role) > -1));
    }
  }
})