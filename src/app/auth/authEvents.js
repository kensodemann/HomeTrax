(function(){
  'use strict';

  angular.module('homeTrax.auth')
    .constant('AuthEvents', {
      notAuthenticated: 'auth-not-authenticated',
      notAuthorized: 'auth-not-authorized'
    });
}());