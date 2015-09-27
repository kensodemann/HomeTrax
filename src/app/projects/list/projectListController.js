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

  function ProjectListController() {
  }
}());