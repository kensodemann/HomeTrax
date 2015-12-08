(function() {
  'use strict';

  angular.module('homeTrax.projects', [
    'ui.router',
    'homeTrax.projects.edit',
    'homeTrax.projects.list',
    'homeTrax.projects.menu'
  ]).config(function($stateProvider) {
    $stateProvider.state('app.projects', {
      url: '/projects',
      abstract: true,
      views: {
        mainShell: {
          template: '<ui-view name="projects"></ui-view>'
        }
      }
    });
  });
}());
