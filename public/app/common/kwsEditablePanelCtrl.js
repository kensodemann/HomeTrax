(function() {
  'use strict';

  angular.module('app.core').controller('kwsEditablePanelCtrl', KwsEditablePanelCtrl);

  function KwsEditablePanelCtrl($scope) {
    var self = this;

    var origModel;

    self.editClicked = startEditing;
    self.cancelClicked = stopEditing;
    self.doneClicked = saveChanges;

    function startEditing() {
      if (!self.editMode) {
        origModel = {};
        $.extend(true, origModel, $scope.kwsModel);
        self.editMode = true;
      }
    }

    function stopEditing() {
      $.extend(true, $scope.kwsModel, origModel);
      self.editMode = false;
    }

    function saveChanges() {
      $scope.kwsModel.$save(function(){
        self.editMode = false;
      });
    }
  }
}());
  