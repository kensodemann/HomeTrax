(function() {
  'use strict';

  angular.module('app.auth').factory('authInterceptor', AuthInterceptor);

  function AuthInterceptor(authToken) {
    return {
      request: function(config) {
        addAuthHeader(config);
        return config;
      }
    };

    function addAuthHeader(config) {
      var token = authToken.get();
      if (!!token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
    }
  }
}());