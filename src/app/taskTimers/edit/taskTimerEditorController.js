(function() {
  'use strict';

  angular.module('homeTrax.taskTimers.edit.taskTimerEditorController', [
    'ui.bootstrap',
    'homeTrax.common.core.EditorMode',
    'homeTrax.common.core.Status',
    'homeTrax.common.filters.hoursMinutes',
    'homeTrax.common.resources.Project',
    'homeTrax.common.services.notifier',
    'homeTrax.common.services.stages',
    'homeTrax.common.services.timeUtilities'
  ]).controller('taskTimerEditorController', TaskTimerEditorController);

  function TaskTimerEditorController($uibModalInstance, taskTimer, mode, Project,
                                     stages, timeUtilities, hoursMinutesFilter, Status, EditorMode, notifier) {
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
      taskTimer.project = controller.project;
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
        Project.query({
          status: Status.active
        }, onSuccess, onFailure);

        function onSuccess(projects) {
          controller.projects = projects;
          assignProject();
        }

        function onFailure(response) {
          notifier.error(response.data.reason);
          controller.errorMessage = response.data.reason;
        }
      }

      function assignProject() {
        if (taskTimer.project) {
          controller.project = _.find(controller.projects, function(project) {
            return project._id === taskTimer.project._id;
          });

          if (!controller.project) {
            controller.project = taskTimer.project;
            controller.projects.push(controller.project);
          }
        }
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
