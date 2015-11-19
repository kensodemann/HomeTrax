(function() {
  'use strict';

  // @ifdef DEBUG
  angular.module('homeTrax.common.core.config', []).constant('config', {
    dataService: 'http://localhost:8080'
  });
  // @endif

  // @ifndef DEBUG
  angular.module('homeTrax.common.core.config', []).constant('config', {
    dataService: 'https://hometraxdata-kensodemann.rhcloud.com'
  });
  // @endif
}());