(function() {
  'use strict';

  angular.module('homeTrax.common.resources.ClientVersions', [])
    .constant('ClientVersions', [{
      id: '2.0.1',
      name: 'Narse (2.0.1)',
      releaseDate: '2015-11-30',
      description: 'Seperate the versions and improve the UI.',
      features: ['Seperate Client and Server Versions'],
      bugFixes: []
    }, {
      id: '2.0.0',
      name: 'BETA (2.0.0)',
      releaseDate: '2015-11-22',
      description: 'The first BETA release of the repurposed HomeTrax project. This release is a very sparse MVP.',
      features: ['Project Setup', 'Stages Based on SBVB Stages', 'JIRA and SBVB Based IDs', 'Basic Time Tracking'],
      bugFixes: []
    }]);
}());