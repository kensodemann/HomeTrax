(function() {
  'use strict';

  angular.module('app').controller('userAdminMenuCtrl', UserAdminMenuCtrl);

  function UserAdminMenuCtrl(identity) {
    var self = this;

    self.identity = identity;
  }
}());