(function() {
  'use strict';

  angular.module('homeTrax.userAdministration')
    .controller('userListController', UserListController)
    .config(function($routeProvider) {
      $routeProvider.when('/userAdministration/userlist', {
        templateUrl: 'app/userAdministration/templates/userList.html',
        controller: 'userListController',
        controllerAs: 'controller'
      });
    });

  function UserListController(User, userEditor) {
    var self = this;

    self.users = User.query();

    self.edit = function(user) {
      userEditor.open(user, 'edit');
    };

    self.create = function() {
      userEditor.open(new User(), 'create', addNewUser);

      function addNewUser(user) {
        self.users.push(user);
      }
    };
  }
}());