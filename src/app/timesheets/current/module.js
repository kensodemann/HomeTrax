(function() {
  'use strict';

  angular.module('homeTrax.timesheets.current', [
    'ngRoute',
    'homeTrax.common.directives.htTaskTimer',
    'homeTrax.common.resources',
    'homeTrax.common.services.dateUtilities',
    'homeTrax.common.services.timesheets'
  ]);
}());
