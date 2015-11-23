(function() {
  'use strict';

  angular.module('homeTrax.about', [
    'ngRoute',
    'ui.bootstrap',
    'homeTrax.about.versionData'
  ]).controller('aboutController', AboutController)
    .config(function($routeProvider) {
      $routeProvider.when('/about', {
        templateUrl: 'app/about/templates/about.html',
        controller: 'aboutController',
        controllerAs: 'controller'
      });
    });

  function AboutController(versionData) {
    var controller = this;

    controller.versions = versionData.allVersions;

    controller.versions.$promise.then(function(d) {
      controller.currentVersion = d[0].name;
    });
  }
}());