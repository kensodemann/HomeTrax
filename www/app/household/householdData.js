(function() {
  'use strict';

  angular.module('app.household').factory('householdData', HouseholdData);

  function HouseholdData(Entity) {
    var exports = {
      load: loadData,
      household: undefined
    };
    return exports;

    function loadData() {
      return Entity.query({entityType: 'household'}).$promise.then(unpackData);

      function unpackData(e) {
        if (e) {
          exports.household = e[e.length - 1];
        }
        return e;
      }
    }
  }
}());