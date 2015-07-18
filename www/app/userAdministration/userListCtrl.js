(function() {
  'use strict';

  angular.module('app.userAdministration').controller('userListCtrl', UserListCtrl);

  function UserListCtrl(User, userEditor) {
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