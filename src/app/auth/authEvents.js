(function(){
  'use strict';

  angular.module('homeTrax.auth.AuthEvents', [])
    .constant('AuthEvents', {
      notAuthenticated: 'auth-not-authenticated',
      notAuthorized: 'auth-not-authorized'
    });
}());