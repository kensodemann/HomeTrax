(function() {
  'use strict';

  angular.module('app.core').directive('kwsPageHeader', kwsPageHeader);

  function kwsPageHeader() {
    return {
      restrict: 'AE',
      scope: {
        kwsLines: '=',
        kwsModel: "="
      },
      link: link,
      templateUrl: '/partials/common/templates/kwsPageHeader',
      controller: 'kwsEditablePanelCtrl',
      controllerAs: 'ctrl'
    };
  }

  function link(scope) {
    generateTemplates(scope.kwsLines);
  }

  function generateTemplates(lines) {
    lines.forEach(function(item) {
      if (!item.template) {
        if (!item.columnName){
          throw new Error("Must have a template or a column name");
        }
        item.template = "{{kwsModel." + item.columnName + "}}";
      }
    });
  }
}());