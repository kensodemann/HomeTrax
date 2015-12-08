(function() {
  'use strict';

  angular.module('homeTrax.main.mainController', [
      'ui.router',
      'homeTrax.auth.identity'
    ])
    .controller('mainController', MainController)
    .config(function($stateProvider) {
      $stateProvider.state('app.main', {
        url: '/',
        views: {
          mainShell: {
            templateUrl: 'app/main/templates/main.html',
            controller: 'mainController as controller'
          }
        }
      });
    });

  function MainController(identity) {
    var message = 'Hello World from Angular!!';

    if (identity.isAuthenticated()) {
      message += '  I am logged in!';
    }

    this.hello = message;
  }
}());