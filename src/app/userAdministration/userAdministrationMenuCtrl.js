(function() {
  'use strict';

  angular.module('homeTrax.userAdministration').controller('userAdministrationMenuCtrl', UserAdministrationMenuCtrl);

  function UserAdministrationMenuCtrl(identity) {
    var self = this;

    self.identity = identity;
  }
}());