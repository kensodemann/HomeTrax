(function() {
  'use strict';

  angular.module('homeTrax.userAdministration')
    .factory('userEditor', userEditor)
    .controller('userEditorController', UserEditorController);

  function userEditor($uibModal) {
    return {
      open: open
    };

    function open(user, mode) {
      return $uibModal.open({
        templateUrl: 'app/userAdministration/templates/userEditor.html',
        backdrop: 'static',
        controller: 'userEditorController',
        controllerAs: 'controller',
        resolve: {
          user: function() {
            return user;
          },

          mode: function() {
            return mode;
          }
        },
        bindToController: true
      });
    }
  }

  function UserEditorController($modalInstance, user, mode, EditorMode, notifier) {
    var controller = this;

    controller.firstName = user.firstName;
    controller.lastName = user.lastName;
    controller.username = user.username;
    controller.isAdministrator = user.isAdministrator();
    controller.title = (mode === EditorMode.create ? 'Create User' : 'Edit User');
    controller.mode = mode;
    controller.errorMessage = undefined;
    controller.save = save;

    function save() {
      updateUserResource();
      user.$save(success, failure);

      function success() {
        notifier.notify(mode === EditorMode.create ? 'User created successfully' : 'Changes to user saved successfully');
        $modalInstance.close(user);
      }

      function failure(response) {
        notifier.error(response.data.reason);
        controller.errorMessage = response.data.reason;
      }

      function updateUserResource() {
        user.firstName = controller.firstName;
        user.lastName = controller.lastName;
        user.username = controller.username;
        user.password = (mode === EditorMode.create ? controller.password : undefined);
        if (controller.isAdministrator) {
          user.addRole('admin');
        } else {
          user.removeRole('admin');
        }
      }
    }
  }
}());
