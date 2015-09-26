/* global angular */
(function() {
  'use strict';

  angular.module('homeTrax.userAdministration').controller('myProfileCtrl', MyProfileCtrl);

  function MyProfileCtrl(User, identity, passwordEditor, notifier) {
    var self = this;

    self.model = currentUser();
    self.reset = reset;
    self.save = saveUser;
    self.openPasswordEditor = openPasswordEditor;

    function reset() {
      self.model = currentUser();
    }

    function saveUser() {
      self.model.$update(success, error);

      function success() {
        notifier.notify('Profile modifications saved successfully');
      }

      function error(err) {
        notifier.error(err.data.reason);
      }
    }

    function openPasswordEditor() {
      passwordEditor.open(identity.currentUser._id);
    }

    function currentUser() {
      return User.get({
        id: identity.currentUser._id
      });
    }
  }
}());