(function() {
  'use strict';

  angular.module('homeTrax.userAdministration.userList', [
      'ui.router',
      'homeTrax.common.core.EditorMode',
      'homeTrax.common.resources.User',
      'homeTrax.userAdministration.userEditor'
    ])
    .controller('userListController', UserListController)
    .config(function($stateProvider) {
      $stateProvider.state('app.userAdministration.userList', {
        url: '/userList',
        views: {
          userAdminView: {
            templateUrl: 'app/userAdministration/userList/userList.html',
            controller: 'userListController',
            controllerAs: 'controller'
          }
        }
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
