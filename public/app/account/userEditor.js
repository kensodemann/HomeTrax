(function() {
  'use strict';

  angular.module('app').factory('userEditor', userEditor);

  function userEditor($rootScope, $modal, notifier) {
    var exports = {
      open: open
    };

    var editorScope = $rootScope.$new();
    var editor = $modal({
      template: '/partials/account/templates/userEditor',
      backdrop: 'static',
      show: false,
      scope: editorScope
    });

    editorScope.ctrl = {
      save: saveOrUpdate
    };

    var userResource;

    return exports;

    function open(user, mode) {
      initializeController();
      editor.$promise.then(editor.show);

      function initializeController() {
        initializeCtrlVariables();
        initializeLabels();
        initializeModel();

        function initializeCtrlVariables() {
          userResource = user;
          editorScope.ctrl.mode = mode;
        }

        function initializeLabels() {
          editorScope.ctrl.title = (mode === 'edit') ? 'Edit User' : 'Create User';
          editorScope.ctrl.saveLabel = (mode === 'edit') ? 'Save' : 'Create';
        }

        function initializeModel() {
          editorScope.ctrl.model = {};
          editorScope.ctrl.model.firstName = user.firstName;
          editorScope.ctrl.model.lastName = user.lastName;
          editorScope.ctrl.model.username = user.username;
        }
      }
    }

    function saveOrUpdate() {
      copyModelToResource();
      saveResource();

      function saveResource() {
        if (editorScope.ctrl.mode === 'create') {
          userResource.$save(success, error);
        } else {
          userResource.$update(success, error);
        }

        function success() {
          notifier.notify((editorScope.ctrl.mode === 'create') ?
            "User created successfully" : "Changes to user saved successfully");
          editor.hide();
        }

        function error(reason) {
          notifier.error(reason.data);
          editorScope.ctrl.errorMessage = reason.data;
        }
      }

      function copyModelToResource() {
        userResource.firstName = editorScope.ctrl.model.firstName;
        userResource.lastName = editorScope.ctrl.model.lastName;
        userResource.username = editorScope.ctrl.model.username;
        if (editorScope.ctrl.mode === 'create') {
          userResource.password = editorScope.ctrl.model.password;
        }
      }
    }
  }
}());