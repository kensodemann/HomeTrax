(function() {
  'use strict';

  angular.module('homeTrax.common.resources.ClientVersions', [])
    .constant('ClientVersions', [{
      id: '2.0.5',
      name: 'Falkor (2.0.5)',
      releaseDate: '2016-05-21',
      description: 'Use Server Clock',
      features: [
        'Use the server clock to calculate elapsed time on running tasks',
        'Expire and refresh tokens',
        'Require SBVB tasks on projects'
      ],
      bugFixes: []
    }, {
        id: '2.0.4',
        name: 'Fírnen (2.0.4)',
        releaseDate: '2015-12-15',
        description: 'View Prior Timesheets',
        features: [
          'Allow previous timesheets to be viewed and modified',
          'Allow the time report for previous timesheets to be viewed'
        ],
        bugFixes: [
          'Added error handling for fetches',
          'Removed minor routing bug'
        ]
      }, {
        id: '2.0.3',
        name: 'Desghidorah (2.0.3)',
        releaseDate: '2015-12-13',
        description: 'Timesheet List, Code Cleanup',
        features: [
          'Added the list of previous timesheets (links do not work yet)',
          'Switched to using the UI router',
          'Refactored some of the code for cleanliness'
        ],
        bugFixes: [
          'Added error handling for fetches',
          'Removed minor routing bug'
        ]
      }, {
        id: '2.0.2',
        name: 'Icefyre (2.0.2)',
        releaseDate: '2015-12-06',
        description: 'Add the Time Report',
        features: [
          'Added a report that provides a daily summary of time spent'
        ],
        bugFixes: []
      }, {
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
} ());