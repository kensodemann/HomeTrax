/* global angular */
(function() {
  'use strict';

  angular.module('app.account').factory('userEditor', userEditor);

  function userEditor($rootScope, $modal, notifier, colors) {
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
      save: saveOrUpdate,
      backgroundColor: setBackgroundColor,
      colorPanelClass: colorPanelClass,
      selectColor: selectColor
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
          editorScope.ctrl.mode = mode;
          editorScope.ctrl.colors = colors.userColors;
        }

        function initializeLabels() {
          editorScope.ctrl.title = (mode === 'edit') ? 'Edit User' : 'Create User';
          editorScope.ctrl.saveLabel = (mode === 'edit') ? 'Save' : 'Create';
        }

        function initializeModel() {
          saveCallback = callback;
          editorScope.ctrl.model = {};
          editorScope.ctrl.model.firstName = user.firstName;
          editorScope.ctrl.model.lastName = user.lastName;
          editorScope.ctrl.model.username = user.username;
          editorScope.ctrl.model.color = user.color;
          editorScope.ctrl.model.isAdministrator = !!user.roles &&
            (user.roles.indexOf('admin') > -1);
        }
      }
    }

    function saveOrUpdate() {
      copyModelToResource();
      saveResource();

      function saveResource() {
        if (editorScope.ctrl.mode === 'create') {
          userResource.$save(success, error);
        }
        else {
          userResource.$update(success, error);
        }

        function success() {
          notifier.notify((editorScope.ctrl.mode === 'create') ?
            "User created successfully" : "Changes to user saved successfully");
          editor.hide();
          if (saveCallback) {
            saveCallback(userResource);
          }
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
        userResource.color = editorScope.ctrl.model.color;
        if (editorScope.ctrl.mode === 'create') {
          userResource.password = editorScope.ctrl.model.password;
        }
        userResource.roles = [];
        if (editorScope.ctrl.model.isAdministrator) {
          userResource.roles.push('admin');
        }
      }
    }

    function setBackgroundColor(color) {
      return {
        "background-color": color
      };
    }

    function colorPanelClass(color) {
      return color === editorScope.ctrl.model.color ? "form-control-selected" : "";
    }

    function selectColor(color) {
      editorScope.ctrl.model.color = color;
    }
  }
}());