/* global angular */
(function() {
  'use strict';

  angular.module('app.account').controller('myProfileCtrl', MyProfileCtrl);

  function MyProfileCtrl(User, identity, passwordEditor, notifier, colors) {
    var self = this;

    self.model = currentUser();
    self.colors = colors.userColors;

    self.reset = function() {
      self.model = currentUser();
    };

    self.save = function() {
      self.model.$update(success, error);

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