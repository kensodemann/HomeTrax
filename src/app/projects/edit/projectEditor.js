(function() {
  'use strict';

  angular.module('homeTrax.projects.edit')
    .factory('projectEditor', projectEditor)
    .controller('projectEditorController', ProjectEditorController);

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

  function ProjectEditorController($modalInstance, project, mode, EditorMode, Status) {
    var controller = this;

    controller.name = project.name;
    controller.jiraTaskId = project.jiraTaskId;
    controller.sbvbTaskId = project.sbvbTaskId;
    controller.isActive = (mode === EditorMode.create || project.status === Status.active);
    controller.title = (mode === EditorMode.create) ? 'Create New Project' : 'Modify Project';

    controller.save = save;

    function save() {
      project.name = controller.name;
      project.jiraTaskId = controller.jiraTaskId;
      project.sbvbTaskId = controller.sbvbTaskId;
      project.status = (controller.isActive ? Status.active : Status.inactive);
      project.$save(onSuccess, onFailure);

      function onSuccess(project) {
        $modalInstance.close(project);
      }

      function onFailure() {
      }
    }
  }
}());