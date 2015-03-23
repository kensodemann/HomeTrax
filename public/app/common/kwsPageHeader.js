(function() {
  'use strict';

  angular.module('app.core')
    .controller('kwsPageHeaderCtrl', KwsPageHeaderCtrl)
    .directive('kwsPageHeader', kwsPageHeader);

  function kwsPageHeader() {
    return {
      restrict: 'AE',
      scope: {
        kwsLines: '=',
        kwsModel: "="
      },
      link: link,
      templateUrl: '/partials/common/templates/kwsPageHeader',
      controller: 'kwsPageHeaderCtrl',
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

  function KwsPageHeaderCtrl($scope) {
    var self = this;

    self.editClicked = startEditing;
    self.cancelClicked = stopEditing;
    self.doneClicked = saveChanges;

    function startEditing() {
      self.editMode = true;
    }

    function stopEditing() {
      self.editMode = false;
    }

    function saveChanges() {
      self.editMode = false;
    }
  }
}());