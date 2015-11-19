(function() {
  'use strict';

  angular.module('homeTrax.projects.edit.projectEditorController', [
      'ui.bootstrap',
      'homeTrax.common.core.EditorMode',
      'homeTrax.common.core.Status',
      'homeTrax.common.directives.htWaitButton',
      'homeTrax.common.services.notifier'
    ]).controller('projectEditorController', ProjectEditorController);

  function ProjectEditorController($modalInstance, project, mode, EditorMode, Status, notifier) {
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

      function onFailure(response) {
        notifier.error(response.data.reason);
        controller.errorMessage = response.data.reason;
      }
    }
  }
}());
