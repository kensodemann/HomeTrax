(function() {
  'use strict';

  angular.module('homeTrax.main.mainController', [
    'ngRoute',
    'homeTrax.auth.identity'
  ])
    .controller('mainController', MainController)
    .config(function($routeProvider){
      $routeProvider.when('/', {
        templateUrl: 'app/main/templates/main.html',
        controller: 'mainController',
        controllerAs: 'controller'
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