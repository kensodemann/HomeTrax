(function() {
  'use strict';

  angular.module('homeTrax.projects.menu', [
    'homeTrax.auth.identity'
  ]).controller('projectsMenuController', ProjectsMenuController);

  function ProjectsMenuController(identity) {
    this.identity = identity;
  }
}());