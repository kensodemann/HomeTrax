(function() {
  'use strict';

  angular.module('homeTrax.userAdministration').controller('myProfileController', MyProfileController);

  function MyProfileController(User, identity, passwordEditor, notifier) {
    var controller = this;

    controller.model = undefined;
    controller.reset = reset;
    controller.save = saveUser;
    controller.openPasswordEditor = openPasswordEditor;

    activate();

    function reset() {
      fetchUserModel();
    }

    function saveUser() {
      controller.model.$update(success, error);

      function success() {
        notifier.notify('Profile modifications saved successfully');
      }

      function error(err) {
        notifier.error(err.data.reason);
      }
    }

    function openPasswordEditor() {
      identity.get().then(function(user) {
        passwordEditor.open(user._id);
      });
    }

    function activate() {
      fetchUserModel();
    }

    function fetchUserModel() {
      identity.get().then(function(user) {
        controller.model = User.get({
          id: user._id
        });
      });
    }
  }
}());