(function(){
  'use strict';

  angular.module('app.auth')
    .constant('AuthEvents', {
      notAuthenticated: 'auth-not-authenticated',
      notAuthorized: 'auth-not-authorized'
    });
}());