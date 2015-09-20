(function() {
  'use strict';

  angular.module('app.core').factory('cacheBuster', CacheBuster);

  function CacheBuster() {
    return {
      get value() {
        return new Date().getTime();
      }
    };
  }
}());