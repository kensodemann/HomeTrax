(function() {
  'use strict';

  angular.module('app.core').directive('kwsDefinitionListPanel', kwsDefinitionListPanel);

  function kwsDefinitionListPanel() {
    return {
      restrict: 'AE',
      scope: {
        kwsTitle: "@",
        kwsLists: "=",
        kwsModel: "="
      },
      templateUrl: '/partials/common/templates/kwsDefinitionListPanel'
    };
  }
}());