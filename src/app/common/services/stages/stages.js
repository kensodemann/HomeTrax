(function() {
  'use strict';

  angular.module('homeTrax.common.services.stages').factory('stages', stages);

  function stages(Stage) {
    var cachedStages;

    return {
      get all() {
        if (!cachedStages) {
          cachedStages = Stage.query();
        }

        return cachedStages;
      }
    };
  }
}());
