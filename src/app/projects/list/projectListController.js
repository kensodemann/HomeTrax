(function() {
  'use strict';

  angular.module('homeTrax.projects.list', [
      'homeTrax.common.core.EditorMode',
      'homeTrax.common.directives.htWaitBar',
      'homeTrax.projects.edit',
      'ngRoute'
    ])
    .controller('projectListController', ProjectListController)
    .config(function($routeProvider) {
      $routeProvider.when('/projects/list', {
        templateUrl: 'app/projects/list/projectList.html',
        controller: 'projectListController',
        controllerAs: 'controller'
      });
    });

  function ProjectListController(Project, projectEditor, EditorMode) {
    var controller = this;

    controller.isQuerying = true;
    controller.projects = Project.query();

    controller.newProject = newProject;
    controller.editProject = editProject;

    activate();

    function newProject() {
      projectEditor.open(new Project(), EditorMode.create).result.then(addProjectToList);

      function addProjectToList(prj) {
        controller.projects.push(prj);
      }
    }

    function editProject(project){
      projectEditor.open(project, EditorMode.edit);
    }

    function activate() {
      controller.projects.$promise.finally(function() {
        controller.isQuerying = false;
      });
    }
  }
}());