(function() {
  'use strict';

  angular.module('app').controller('mainCtrl', MainCtrl);

  function MainCtrl(identity) {
    var message = 'Hello World from Angular!!';

    if (identity.isAuthenticated()) {
      message += '  I am logged in!';
    }

    this.hello = message;
  }
}());