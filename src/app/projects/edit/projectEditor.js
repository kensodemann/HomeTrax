(function() {
  'use strict';

  angular.module('homeTrax.projects.edit.projectEditor', [
      'ui.bootstrap'
  ]).factory('projectEditor', projectEditor);

  function projectEditor($uibModal) {
    return {
      open: open
    };

    function open(project, mode) {
      return $uibModal.open({
        templateUrl: 'app/projects/edit/projectEditor.html',
        backdrop: 'static',
        controller: 'projectEditorController',
        controllerAs: 'controller',
        resolve: {
          project: function() {
            return project;
          },

          mode: function() {
            return mode;
          }
        },
        bindToController: true
      });
    }
  }
}());
