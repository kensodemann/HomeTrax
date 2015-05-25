(function() {
  'use strict';
  
  angular.module('app.core').factory('Entity', Entity);
  
  function Entity($resource){
      return $resource('/api/entities/:id', {
      id: "@_id"
    });
  }
})();