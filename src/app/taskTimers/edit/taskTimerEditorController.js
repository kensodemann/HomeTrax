(function() {
  'use strict';

  angular.module('homeTrax.taskTimers.edit.taskTimerEditorController', [
    'ui.bootstrap',
    'homeTrax.common.core.EditorMode',
    'homeTrax.common.core.Status',
    'homeTrax.common.filters.hoursMinutes',
    'homeTrax.common.services.notifier',
    'homeTrax.common.services.stages',
    'homeTrax.common.services.timeUtilities',
    'homeTrax.taskTimers.edit.taskTimerEditorService'
  ]).controller('taskTimerEditorController', TaskTimerEditorController);

  function TaskTimerEditorController($uibModalInstance, taskTimer, mode, taskTimerEditorService,
                                     stages, timeUtilities, hoursMinutesFilter, EditorMode, notifier) {
    var controller = this;

    controller.projects = [];
    controller.stages = stages.all;
    controller.stage = undefined;
    controller.timeSpent = taskTimer.milliseconds ? hoursMinutesFilter(taskTimer.milliseconds) : undefined;
    controller.isSaving = false;

    controller.save = save;

    activate();

    function save() {
      controller.isSaving = true;
      taskTimer.stage = controller.stage;
      taskTimer.project = controller.project.resource;
      if (!taskTimer.isActive) {
        taskTimer.milliseconds = timeUtilities.parse(controller.timeSpent);
      }

      taskTimer.$save(onSuccess, onFailure);

      function onSuccess(tt) {
        controller.isSaving = false;
        $uibModalInstance.close(tt);
      }

      function onFailure(response) {
        controller.isSaving = false;
        notifier.error(response.data.reason);
        controller.errorMessage = response.data.reason;
      }
    }

    function activate() {
      setTitle();
      getProjects();
      assignStage();

      function setTitle() {
        if (mode === EditorMode.edit) {
          controller.title = 'Edit Task Timer';
        } else {
          controller.title = 'New Task Timer';
        }
      }

      function getProjects() {
        taskTimerEditorService.getActiveProjects().then(function(projects) {
          controller.projects = projects;
          if (taskTimer.project) {
            controller.project = taskTimerEditorService.selectProject(controller.projects, taskTimer.project);
          }
        });
      }

      function assignStage() {
        if (taskTimer.stage) {
          controller.stages.$promise.then(function() {
            controller.stage = _.find(controller.stages, function(stage) {
              return stage._id === taskTimer.stage._id;
            });
          });
        }
      }
    }
  }
}());
