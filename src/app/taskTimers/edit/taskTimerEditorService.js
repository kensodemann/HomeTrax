(function() {
  'use strict';

  angular.module('homeTrax.taskTimers.edit.taskTimerEditorService', [
    'homeTrax.common.core.Status',
    'homeTrax.common.resources.Project'
  ]).factory('taskTimerEditorService', taskTimerEditorService);

  var forEach = angular.forEach;

  function taskTimerEditorService(Project, Status) {
    return {
      getActiveProjects: getActiveProjects,
      selectProject: selectProject
    };

    function getActiveProjects() {
      var q = Project.query({
        status: Status.active
      });
      return q.$promise.then(processProjects);
    }

    function processProjects(projects) {
      var prjs = [];
      forEach(projects, pushWrappedProject);
      return prjs;

      function pushWrappedProject(prj) {
        prjs.push(new WrappedProject(prj));
      }
    }

    function WrappedProject(prj) {
      this.resource = prj;
      this.displayName = prj.name +
        (prj.jiraTaskId ? ' [' + prj.jiraTaskId + ']' : '') +
        (prj.sbvbTaskId ? ' (' + prj.sbvbTaskId + ')' : '');
    }


    function selectProject(projects, project) {
      var p = findProject(projects, project);
      if (!p) {
        projects.push(new WrappedProject(project));
        p = projects[projects.length - 1];
      }

      return p;
    }

    function findProject(projects, project) {
      var p = _.find(projects, function(prj) {
        return prj.resource._id === project._id;
      });

      return p;
    }
  }
}());