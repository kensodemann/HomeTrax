(function() {
  'use strict';

  angular.module('homeTrax.main').factory('versionData', VersionData);

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