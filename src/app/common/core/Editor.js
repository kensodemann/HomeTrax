(function() {
  'use strict';

  var _editorModes;
  var _rootScope;

  angular.module('app.core')
    .constant('Editor', Editor)
    .run(function($rootScope, editorModes) {
      _rootScope = $rootScope;
      _editorModes = editorModes;
    });

  function Editor(modal, template, entityName) {
    var self = this;

    self.entityName = entityName;
    self.editorScope = _rootScope.$new(true);
    self.editorScope.controller = {
      save: function() {
        self.save();
      }
    };

    self.editor = modal({
      template: template,
      backdrop: 'static',
      scope: self.editorScope,
      show: false
    });
  }

  var saved;

  Editor.prototype = {
    open: function(model, mode, saveCallback) {
      var self = this;

      if (mode === _editorModes.modify) {
        self.editorScope.controller.title = 'Modify ' + self.entityName;
      } else {
        self.editorScope.controller.title = 'New ' + self.entityName;
      }

      self.copyToController(model);
      self.editor.$promise.then(function() {
        self.editor.show();
      });

      saved = saveCallback;
    },

    save: function() {
      var self = this;

      self.copyToResourceModel();
      self.editorScope.model.$save(success, error);

      function success(model) {
        self.editor.hide();
        saved(model);
      }

      function error(response) {
        self.editorScope.controller.errorMessage = response.data.reason;
      }
    },

    copyToController: function(model) {
      this.editorScope.model = model;
    },

    copyToResourceModel: function() {

    }
  };
}());