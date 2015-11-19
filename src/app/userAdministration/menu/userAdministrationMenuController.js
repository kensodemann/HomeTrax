(function() {
  'use strict';

  angular.module('homeTrax.userAdministration.menu', [
    'homeTrax.auth.identity'
  ]).controller('userAdministrationMenuController', UserAdministrationMenuController);

  function UserAdministrationMenuController(identity) {
    var self = this;

    self.identity = identity;
  }
}());