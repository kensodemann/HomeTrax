(function() {
  'use strict';

  angular.module('homeTrax.userAdministration').controller('userAdministrationMenuController', UserAdministrationMenuController);

  function UserAdministrationMenuController(identity) {
    var self = this;

    self.identity = identity;
  }
}());