(function() {
  'use strict';

  angular.module('homeTrax.projects').controller('projectsMenuController', ProjectsMenuController);

  function ProjectsMenuController(identity) {
    this.identity = identity;
  }
}());