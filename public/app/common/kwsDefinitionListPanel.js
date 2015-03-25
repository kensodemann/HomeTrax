(function() {
  'use strict';

  angular.module('app.core').directive('kwsDefinitionListPanel', kwsDefinitionListPanel);

  var filter;

  function kwsDefinitionListPanel($filter) {
    filter = $filter;

    return {
      restrict: 'AE',
      scope: {
        kwsTitle: "@",
        kwsLists: "=",
        kwsModel: "="
      },
      link: link,
      templateUrl: '/partials/common/templates/kwsDefinitionListPanel',
      controller: 'kwsEditablePanelCtrl',
      controllerAs: 'ctrl'
    };
  }

  function link(scope) {
    generateTemplates(scope.kwsLists);
  }

  function generateTemplates(lists) {
    lists.forEach(function(list) {
      list.forEach(function(item) {
        if (!item.template) {
          if (!item.columnName) {
            throw new Error("Must have a template or a column name");
          }
          item.template = "{{kwsModel." + item.columnName + "}}";
        }
      });
    });
  }
}());