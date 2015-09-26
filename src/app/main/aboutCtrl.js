(function() {
  'use strict';

  angular.module('homeTrax.main').controller('aboutCtrl', AboutCtrl);

  function AboutCtrl(versionData) {
    var self = this;

    self.versions = versionData.allVersions;

    self.versions.$promise.then(function(d) {
      self.currentVersion = d[0].name;
    });
  }
}());