(function() {
  'use strict';

  angular.module('app.account').controller('userAdminMenuCtrl', UserAdminMenuCtrl);

  function UserAdminMenuCtrl(identity) {
    var self = this;

    self.identity = identity;
  }
}());