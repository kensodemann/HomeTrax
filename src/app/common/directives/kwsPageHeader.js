(function() {
  'use strict';

  angular.module('app.core').directive('kwsPageHeader', kwsPageHeader);

  function kwsPageHeader() {
    return {
      restrict: 'AE',
      scope: {
        kwsLines: '=',
        kwsModel: '='
      },
      link: link,
      templateUrl: 'app/common/templates/kwsPageHeader.html',
      controller: 'kwsEditablePanelCtrl',
      controllerAs: 'ctrl'
    };
  }

  function link(scope) {
    createDefaultTemplates(scope.kwsLines);
  }

  function createDefaultTemplates(lines) {
    lines.forEach(function(line) {
      if (isVisibleInViewMode(line) && !line.template) {
        createViewModeTemplate(line);
      }

      if (isVisibleInEditMode(line) && !line.editTemplate) {
        createEditModeTemplate(line);
      }
    });

    function isVisibleInViewMode(line) {
      return (line.modes && line.modes.indexOf('V') > -1);
    }

    function isVisibleInEditMode(line) {
      return (line.modes && line.modes.indexOf('E') > -1);
    }

    function createViewModeTemplate(line) {
      if (!line.columnName) {
        throw new Error('Must have a view template or a column name');
      }

      line.template = '{{kwsModel.' + line.columnName + '}}';
    }

    function createEditModeTemplate(line){
      if (!line.columnName) {
        throw new Error('Must have an edit template or a column name');
      }

      var cn = line.columnName;
      line.editTemplate = '<input class="form-control" name="' + cn + '" ng-model="kwsModel[\'' + cn + '\']">';
    }
  }
}());