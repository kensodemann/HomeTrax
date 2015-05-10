(function() {
  'use strict';

  angular.module('app.financial')
    .factory('transactionEditor', TransactionEditor);

  function TransactionEditor($rootScope, $modal, editorModes) {
    var service = {
      open:open
    };

    var editorScope = $rootScope.$new(true);
    var editor = $modal({
      template: '/partials/financial/transactionEditor/template',
      backdrop: 'static',
      scope: editorScope,
      show: false
    });
    var saved;

    createEditorScope();

    return service;

    function open(){
      editor.$promise.then(function() {
        editor.show();
      });
    }

    function createEditorScope() {
      editorScope.controller = {
      };
    }
  }
}());