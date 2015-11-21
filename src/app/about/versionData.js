(function() {
  'use strict';

  angular.module('homeTrax.about.versionData', [
    'homeTrax.common.resources.Versions'
  ]).factory('versionData', VersionData);

  function VersionData(Versions) {
    var exports = {
      allVersions: undefined
    };

    if (!exports.allVersions) {
      exports.allVersions = Versions.query();
    }

    return exports;
  }
}());