(function() {
  'use strict';

  angular.module('app.household').factory('householdData', HouseholdData);

  function HouseholdData(Household) {
    var exports =  {
      load: loadData,
      household: undefined
    };
    return exports;

    function loadData() {
      return Household.query().$promise.then(unpackData);

      function unpackData(h) {
        if(h) {
          exports.household = h[h.length - 1];
        }
        return h;
      }
    }
  }
}());