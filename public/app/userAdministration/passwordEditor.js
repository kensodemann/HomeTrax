(function() {
  'use strict';

  angular.module('app.userAdministration').factory('passwordEditor', PasswordEditor);

  function PasswordEditor($rootScope, $modal, UserPassword, notifier) {
    var exports = {
      open: open
    };

    var editorScope = $rootScope.$new(true);
    var editor = $modal({
      template: '/partials/userAdministration/templates/passwordEditor',
      show: false,
      backdrop: 'static',
      scope: editorScope
    });

    editorScope.ctrl = {
      setPassword: setPassword,
      message: 'This is from the editor service'
    };
    editorScope.ctrl.model = new UserPassword();

    function setPassword() {
      editorScope.ctrl.model.$update(success, error);

      function success() {
        notifier.notify('Password changed successfully');
        editor.hide();
      }

      function error(resp) {
        notifier.error(resp.data.reason);
        editorScope.ctrl.errorMessage = resp.data.reason;
      }
    }

    function open(id) {
      var model = editorScope.ctrl.model;
      model._id = id;
      model.password = '';
      model.newPassword = '';
      model.verifyPassword = '';
      editor.show();
    }

    return exports;
  }
}());