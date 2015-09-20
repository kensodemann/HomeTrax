(function() {
  'use strict';

  angular.module('app.userAdministration').controller('userAdministrationMenuCtrl', UserAdministrationMenuCtrl);

  function UserAdministrationMenuCtrl(identity) {
    var self = this;

    self.identity = identity;
  }
}());