(function() {
  'use strict';

  angular.module('homeTrax.userAdministration').factory('passwordEditor', PasswordEditor);

  function PasswordEditor($rootScope, $modal, UserPassword, notifier) {
    var exports = {
      open: open
    };

    var editorScope = $rootScope.$new(true);
    var editor = $modal({
      template: 'app/userAdministration/templates/passwordEditor.html',
      show: false,
      backdrop: 'static',
      scope: editorScope
    });

    editorScope.controller = {
      setPassword: setPassword,
      message: 'This is from the editor service'
    };
    editorScope.controller.model = new UserPassword();

    function setPassword() {
      editorScope.controller.model.$update(success, error);

      function success() {
        notifier.notify('Password changed successfully');
        editor.hide();
      }

      function error(resp) {
        notifier.error(resp.data.reason);
        editorScope.controller.errorMessage = resp.data.reason;
      }
    }

    function open(id) {
      var model = editorScope.controller.model;
      model._id = id;
      model.password = '';
      model.newPassword = '';
      model.verifyPassword = '';
      editor.show();
    }

    return exports;
  }
}());