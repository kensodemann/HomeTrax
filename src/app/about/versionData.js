(function() {
  'use strict';

  angular.module('homeTrax.about').factory('versionData', VersionData);

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