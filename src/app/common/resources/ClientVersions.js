(function() {
  'use strict';

  angular.module('homeTrax.common.resources.ClientVersions', [])
    .constant('ClientVersions', [{
      id: '2.0.1',
      name: 'Narse (2.0.1)',
      releaseDate: '2015-11-30',
      description: 'Seperate the versions and improve the UI.',
      features: [
        'Version the client and the server seperately',
        'Display the stage in the timer on the current timesheet view',
        'Show the JIRA and SBVB task ID in the project drop-down list',
        'Hide the JIRA and SBVB task IDs if they do not exist',
        'Refresh the displayed elapsed time as a timer runs'
      ],
      bugFixes: [
        'Fixed issue with total time not refreshing when a timer was stopped'
      ]
    }, {
      id: '2.0.0',
      name: 'BETA (2.0.0)',
      releaseDate: '2015-11-22',
      description: 'The first BETA release of the repurposed HomeTrax project. This release is a very sparse MVP.',
      features: ['Project Setup', 'Stages Based on SBVB Stages', 'JIRA and SBVB Based IDs', 'Basic Time Tracking'],
      bugFixes: []
    }]);
}());