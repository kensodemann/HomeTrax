(function() {
  'use strict';

  angular.module('homeTrax.common.services.stages', [
    'homeTrax.common.resources'
  ]).factory('stages', stages);

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
