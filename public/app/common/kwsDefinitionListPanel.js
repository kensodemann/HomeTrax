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
        if (isVisibleInViewMode(item) && !item.template) {
          createViewModeTemplate(item);
        }
        if (isVisibleInEditMode(item) && !item.editTemplate) {
          createEditModeTemplate(item);
        }
      });
    });

    function isVisibleInViewMode(item) {
      return (item.modes && item.modes.indexOf('V') > -1);
    }

    function isVisibleInEditMode(item) {
      return (item.modes && item.modes.indexOf('E') > -1);
    }

    function createViewModeTemplate(item) {
      if (!item.columnName) {
        throw new Error("Must have a view template or a column name");
      }
      item.template = "{{kwsModel." + item.columnName + "}}";
    }

    function createEditModeTemplate(item) {
      if (!item.columnName) {
        throw new Error("Must have an edit template or a column name");
      }
      var cn = item.columnName;
      item.editTemplate = '<input class="form-control" name="' + cn + '" ng-model="kwsModel[\'' + cn + '\']">';
    }
  }
}());