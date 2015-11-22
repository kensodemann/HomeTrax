(function() {
  'use strict';

  angular.module('homeTrax.userAdministration.userList', [
    'ngRoute',
    'homeTrax.common.core.EditorMode',
    'homeTrax.common.resources.User',
    'homeTrax.userAdministration.userEditor'
  ])
    .controller('userListController', UserListController)
    .config(function($routeProvider) {
      $routeProvider.when('/userAdministration/userlist', {
        templateUrl: 'app/userAdministration/userList/userList.html',
        controller: 'userListController',
        controllerAs: 'controller'
      });
    });

  function UserListController(User, userEditor, EditorMode) {
    var self = this;

    self.users = User.query();

    self.edit = function(user) {
      userEditor.open(user, EditorMode.edit);
    };

    self.create = function() {
      userEditor.open(new User(), EditorMode.create).result.then(addNewUser);

      function addNewUser(user) {
        self.users.push(user);
      }
    };
  }
}());
