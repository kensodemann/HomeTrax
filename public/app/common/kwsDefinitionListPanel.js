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
      templateUrl: '/partials/common/templates/kwsDefinitionListPanel'
    };
  }

  function link(scope, element, attributes, controller) {
    assignDisplayValues(scope.kwsLists, scope.kwsModel);
  }

  function assignDisplayValues(lists, model) {
    lists.forEach(function(list) {
      list.forEach(function(item) {
        if (!!item.columnName) {
          item.displayValue = formatModelValue(item, model);
        } else {
          item.displayValue = item.value;
        }
      });
    });

    function formatModelValue(listItem, model) {
      if (listItem.dataType === 'date') {
        return filter('date')(model[listItem.columnName], 'mediumDate');
      }
      if (!!listItem.dataType && listItem.dataType !== 'string') {
        return filter(listItem.dataType)(model[listItem.columnName]);
      }
      return model[listItem.columnName];
    }
  }

  function backupEditableValues() {

  }

  function restoreEditableValues() {

  }
}());