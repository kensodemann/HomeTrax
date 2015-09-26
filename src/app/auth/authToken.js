(function() {
  'use strict';

  angular.module('homeTrax.auth').factory('authToken', AuthToken);

  function AuthToken(localStorageService) {
    var key = 'authToken';
    var cachedToken = null;

    return {
      get: function() {
        if (!cachedToken){
          cachedToken = localStorageService.get(key);
        }

        return cachedToken;
      },

      set: function(value) {
        localStorageService.set(key, value);
        cachedToken = value;
      },

      clear: function() {
        localStorageService.remove(key);
        cachedToken = null;
      }
    };
  }
}());