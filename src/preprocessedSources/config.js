(function() {
  'use strict';

  // @ifdef DEBUG
  angular.module('app.core').constant('config', {
    dataService: 'http://localhost:8080'
  });
  // @endif

  // @ifndef DEBUG
  angular.module('app.core').constant('config', {
    dataService: 'https://hometraxdata-kensodemann.rhcloud.com'
  });
  // @endif
}());