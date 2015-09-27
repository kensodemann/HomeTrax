/* global angular */
(function() {
  'use strict';

  angular.module('homeTrax.userAdministration').factory('userEditor', userEditor);

  function userEditor($rootScope, $modal, notifier) {
    var exports = {
      open: open
    };

    var editorScope = $rootScope.$new();
    var editor = $modal({
      template: 'app/userAdministration/templates/userEditor.html',
      backdrop: 'static',
      show: false,
      scope: editorScope
    });

    editorScope.controller = {
      save: saveOrUpdate
    };

    var saveCallback;
    var userResource;

    return exports;

    function open(user, mode, callback) {
      initializeController();
      editor.$promise.then(editor.show);

      function initializeController() {
        initializeCtrlVariables();
        initializeLabels();
        initializeModel();

        function initializeCtrlVariables() {
          userResource = user;
          editorScope.controller.mode = mode;
        }

        function initializeLabels() {
          editorScope.controller.title = (mode === 'edit') ? 'Edit User' : 'Create User';
          editorScope.controller.saveLabel = (mode === 'edit') ? 'Save' : 'Create';
        }

        function initializeModel() {
          saveCallback = callback;
          editorScope.controller.model = {};
          editorScope.controller.model.firstName = user.firstName;
          editorScope.controller.model.lastName = user.lastName;
          editorScope.controller.model.username = user.username;
          editorScope.controller.model.isAdministrator = !!user.roles &&
            (user.roles.indexOf('admin') > -1);
        }
      }
    }

    function saveOrUpdate() {
      copyModelToResource();
      saveResource();

      function saveResource() {
        if (editorScope.controller.mode === 'create') {
          userResource.$save(success, error);
        }
        else {
          userResource.$update(success, error);
        }

        function success() {
          notifier.notify((editorScope.controller.mode === 'create') ?
            'User created successfully' : 'Changes to user saved successfully');
          editor.hide();
          if (saveCallback) {
            saveCallback(userResource);
          }
        }

        function error(reason) {
          notifier.error(reason.data);
          editorScope.controller.errorMessage = reason.data;
        }
      }

      function copyModelToResource() {
        userResource.firstName = editorScope.controller.model.firstName;
        userResource.lastName = editorScope.controller.model.lastName;
        userResource.username = editorScope.controller.model.username;
        if (editorScope.controller.mode === 'create') {
          userResource.password = editorScope.controller.model.password;
        }

        userResource.roles = [];
        if (editorScope.controller.model.isAdministrator) {
          userResource.roles.push('admin');
        }
      }
    }
  }
}());