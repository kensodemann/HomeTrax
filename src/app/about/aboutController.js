(function() {
  'use strict';

  angular.module('homeTrax.about', [
    'ngRoute',
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
    var self = this;

    self.versions = versionData.allVersions;

    self.versions.$promise.then(function(d) {
      self.currentVersion = d[0].name;
    });
  }
}());