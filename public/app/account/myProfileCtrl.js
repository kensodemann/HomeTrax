/* global angular */
(function() {
  'use strict';

  angular.module('app.account').controller('myProfileCtrl', MyProfileCtrl);

  function MyProfileCtrl(User, identity, passwordEditor, notifier) {
    var self = this;

    self.user = currentUser();

    self.reset = function() {
      self.user = currentUser();
    };

    self.save = function() {
      self.user.$update(success, error);

      function success() {
        notifier.notify('Profile modifications saved successfully');
      }

      function error(err) {
        notifier.error(err.data.reason);
      }
    };

    self.backgroundColor = function(color) {
      return {
        "background-color": color
      };
    };

    self.openPasswordEditor = function() {
      passwordEditor.open(identity.currentUser._id);
    };

    function currentUser() {
      return User.get({
        id: identity.currentUser._id
      });
    }
  }
}());