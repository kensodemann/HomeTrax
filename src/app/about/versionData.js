(function() {
  'use strict';

  angular.module('homeTrax.about.versionData', [
    'homeTrax.common.resources.ServerVersions'
  ]).factory('versionData', VersionData);

  function VersionData(ServerVersions) {
    var exports = {
      allVersions: undefined
    };

    if (!exports.allVersions) {
      exports.allVersions = ServerVersions.query();
    }

    return exports;
  }
}());