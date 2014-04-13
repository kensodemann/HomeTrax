angular.module('app').factory('trxIdentity', function($window, trxUser) {
  var currentUser;
  
  if(!!$window.bootstrappedUserObject) {
    currentUser = new trxUser();
    angular.extend(currentUser, $window.bootstrappedUserObject);
  }

  return {
    currentUser: currentUser,
    isAuthenticated: function() {
      return !!this.currentUser;
    },
    isAuthorized: function(role) {
      return !!this.currentUser && this.currentUser.roles.indexOf(role) > -1;
    }
  }
})