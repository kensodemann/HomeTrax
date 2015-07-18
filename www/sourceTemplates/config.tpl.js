(function() {
  'use strict';

  angular.module('app.core').constant('config', {
    // @ifdef DEBUG
    dataService: 'http://localhost:8080'
    // @endif
    // @ifndef DEBUG
    dataService: 'https://hometraxdata-kensodemann.rhcloud.com/'
    // @endif
  });
}());