(function() {
  'use strict';

  angular.module('app').controller('userAdminMenuCtrl', UserAdminMenuCtrl);

  function UserAdminMenuCtrl($scope, identity) {
    $scope.identity = identity;
  }
}());