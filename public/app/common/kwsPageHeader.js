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
      templateUrl: '/partials/common/templates/kwsPageHeader'
    };
  }

  function link(scope, element, attributes, controller) {
    assignDisplayValues(scope.kwsLines, scope.kwsModel);
  }

  function assignDisplayValues(lines, model) {
    lines.forEach(function(item) {
      if (!!item.columnName) {
        item.displayValue = model[item.columnName];
      } else {
        item.displayValue = item.value;
      }
    });
  }
}());