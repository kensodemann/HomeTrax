/* global angular */
(function() {
  'use strict';

  angular.module('app.account').controller('myProfileCtrl', MyProfileCtrl);

  function MyProfileCtrl(User, identity, passwordEditor, notifier, colors) {
    var self = this;

    self.model = currentUser();
    self.reset = reset;
    self.save = saveUser;
    self.backgroundColor = backgroundColor;
    self.colorPanelClass = colorPanelClass;
    self.selectColor = selectColor;
    self.openPasswordEditor = openPasswordEditor;
    self.colors = colors.userColors;

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

    function backgroundColor(color) {
      return {
        "background-color": color
      };
    }

    function colorPanelClass(color) {
      return color === self.model.color ? "form-control-selected" : "";
    }

    function selectColor(color) {
      self.model.color = color;
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