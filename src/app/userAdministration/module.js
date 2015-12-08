(function() {
  'use strict';

  angular.module('homeTrax.userAdministration', [
    'homeTrax.userAdministration.menu',
    'homeTrax.userAdministration.myProfile',
    'homeTrax.userAdministration.userList'
  ]).config(function($stateProvider) {
    $stateProvider.state('app.userAdministration', {
      url: '/userAdministration',
      abstract: true,
      views: {
        mainShell: {
          template: '<ui-view name="userAdminView"></ui-view>'
        }
      }
    });
  });
}());