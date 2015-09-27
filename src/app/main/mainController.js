(function() {
  'use strict';

  angular.module('homeTrax.main').controller('mainController', MainController);

  function MainController(identity) {
    var message = 'Hello World from Angular!!';

    if (identity.isAuthenticated()) {
      message += '  I am logged in!';
    }

    this.hello = message;
  }
}());