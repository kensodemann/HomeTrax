(function() {
  'use strict';

  angular.module('homeTrax.common.services', [
    'homeTrax.common.services.cacheBuster',
    'homeTrax.common.services.dateUtilities',
    'homeTrax.common.services.messageDialog',
    'homeTrax.common.services.notifier',
    'homeTrax.common.services.stages'
  ]);
}());
