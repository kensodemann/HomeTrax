(function() {
  'use strict';

  angular.module('homeTrax.taskTimers.edit.taskTimerEditor', [
    'ui.bootstrap'
  ]).factory('taskTimerEditor', taskTimerEditor);

  function taskTimerEditor($uibModal) {
    return {
      open: open
    };

    function open(taskTimer, mode) {
      return $uibModal.open({
        templateUrl: 'app/taskTimers/edit/taskTimerEditor.html',
        backdrop: 'static',
        controller: 'taskTimerEditorController',
        controllerAs: 'controller',
        resolve: {
          taskTimer: function() {
            return taskTimer;
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
