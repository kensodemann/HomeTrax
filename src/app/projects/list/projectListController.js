(function() {
  'use strict';

  angular.module('homeTrax.projects.list')
    .controller('projectListController', ProjectListController)
    .config(function($routeProvider) {
      $routeProvider.when('/projects/list', {
        templateUrl: 'app/projects/list/projectList.html',
        controller: 'projectListController',
        controllerAs: 'controller'
      });
    });

  function ProjectListController(Project) {
    var controller = this;

    controller.isQuerying = true;
    controller.projects = Project.query();

    activate();

    function activate() {
      controller.projects.$promise.finally(function(){
        controller.isQuerying = false;
      });
    }
  }
}());