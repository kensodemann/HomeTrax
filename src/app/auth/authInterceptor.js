(function() {
  'use strict';

  angular.module('homeTrax.auth').factory('authInterceptor', AuthInterceptor);

  function AuthInterceptor($rootScope, $q, AuthEvents, authToken) {
    return {
      request: function(config) {
        addAuthHeader(config);
        return config;
      },

      responseError: function(response) {
        $rootScope.$broadcast({
          401: AuthEvents.notAuthenticated,
          403: AuthEvents.notAuthorized
        }[response.status], response);
        return $q.reject(response);
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