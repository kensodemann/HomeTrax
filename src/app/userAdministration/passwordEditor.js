(function() {
  'use strict';

  angular.module('homeTrax.userAdministration')
    .factory('passwordEditor', passwordEditor)
    .controller('passwordEditorController', PasswordEditorController);

  function passwordEditor($modal) {
    return {
      open: open
    };

    function open(id) {
      return $modal.open({
        templateUrl: 'app/userAdministration/templates/passwordEditor.html',
        backdrop: 'static',
        controller: 'passwordEditorController',
        controllerAs: 'controller',
        resolve: {
          userId: function() {
            return id;
          }
        },
        bindToController: true
      });
    }
  }

  function PasswordEditorController($modalInstance, notifier, UserPassword, userId) {
    var controller = this;

    controller.model = undefined;
    controller.errorMessage = undefined;

    controller.save = savePasswordChange;

    activate();

    function activate() {
      controller.model = new UserPassword({_id: userId});
    }

    function savePasswordChange() {
      controller.model.$update(success, error);

      function success() {
        notifier.notify('Password changed successfully');
        $modalInstance.close();

      }

      function error(response) {
        notifier.error(response.data.reason);
        controller.errorMessage = response.data.reason;
      }
    }
  }

  //function PasswordEditor($rootScope, $modal, UserPassword, notifier) {
  //  var exports = {
  //    open: open
  //  };
  //
  //  var editorScope = $rootScope.$new(true);
  //  var editor = $modal({
  //    template: 'app/userAdministration/templates/passwordEditor.html',
  //    show: false,
  //    backdrop: 'static',
  //    scope: editorScope
  //  });
  //
  //  editorScope.controller = {
  //    setPassword: setPassword,
  //    message: 'This is from the editor service'
  //  };
  //  editorScope.controller.model = new UserPassword();
  //
  //  function setPassword() {
  //    editorScope.controller.model.$update(success, error);
  //
  //    function success() {
  //      notifier.notify('Password changed successfully');
  //      editor.hide();
  //    }
  //
  //    function error(resp) {
  //      notifier.error(resp.data.reason);
  //      editorScope.controller.errorMessage = resp.data.reason;
  //    }
  //  }
  //
  //  function open(id) {
  //    var model = editorScope.controller.model;
  //    model._id = id;
  //    model.password = '';
  //    model.newPassword = '';
  //    model.verifyPassword = '';
  //    editor.show();
  //  }
  //
  //  return exports;
  //}
}());