(function() {
  'use strict';

  angular.module('homeTrax.about.versionData', [
    'homeTrax.common.resources.ClientVersions',
    'homeTrax.common.resources.ServerVersions'
  ]).factory('versionData', VersionData);

  function VersionData(ClientVersions, ServerVersions) {
    var exports = {
      clientVersions: ClientVersions,
      serverVersions: undefined
    };

    if (!exports.serverVersions) {
      exports.serverVersions = ServerVersions.query();
    }

    return exports;
  }
}());