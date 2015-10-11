(function() {
  'use strict';

  angular.module('homeTrax.auth', [
    'homeTrax.common.core',
    'homeTrax.common.directives.htWaitButton',
    'homeTrax.common.resources',
    'homeTrax.common.services.cacheBuster',
    'homeTrax.common.services.notifier',
    'ngRoute'
  ]);
}());