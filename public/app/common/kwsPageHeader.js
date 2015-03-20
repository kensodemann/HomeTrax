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

  function link(scope, element, attributes, controller) {
    assignDisplayValues(scope.kwsLines, scope.kwsModel);
  }

  function assignDisplayValues(lines, model) {
    lines.forEach(function(item) {
      if (!!item.columnName) {
        item.displayValue = model[item.columnName];
        item.template = "{{line." + item.columnName + "}}";
      } else {
        item.displayValue = item.value;
      }
    });
  }

  function KwsPageHeaderCtrl($scope){
    var self = this;

    self.editClicked = startEditing;
    self.cancelClicked = stopEditing;
    self.doneClicked = saveChanges;

    function startEditing(){
      self.editMode = true;
    }

    function stopEditing(){
      self.editMode = false;
    }

    function saveChanges(){
      assignDisplayValues($scope.kwsLines, $scope.kwsModel);
      self.editMode = false;
    }
  }
}());