(function() {
  'use strict';

  angular.module('app.household').factory('Household', Household);

  function Household($resource) {
    return $resource('/api/households/:id', {
      id: "@_id"
    });
  }
}());