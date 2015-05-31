(function() {
  'use strict';

  angular.module('app.core').factory('Entity', Entity);

  function Entity(HomeAppResource) {
    return new HomeAppResource('entities');
  }
})();