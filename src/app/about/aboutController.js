(function() {
  'use strict';

  angular.module('homeTrax.about', [
      'ui.router',
      'ui.bootstrap',
      'homeTrax.about.versionData'
    ]).controller('aboutController', AboutController)
    .config(function($stateProvider) {
      $stateProvider.state('app.about', {
        url: '/about',
        views: {
          mainShell: {
            templateUrl: 'app/about/templates/about.html',
            controller: 'aboutController as controller'
          }
        }
      });
    });

  function AboutController(versionData) {
    var controller = this;

    controller.clientVersions = versionData.clientVersions;
    controller.serverVersions = versionData.serverVersions;

    getCurrentVersions();

    function getCurrentVersions() {
      controller.currentClientVersion = controller.clientVersions[0].name;

      controller.serverVersions.$promise.then(function(d) {
        controller.currentServerVersion = d[0].name;
      });
    }
  }
}());