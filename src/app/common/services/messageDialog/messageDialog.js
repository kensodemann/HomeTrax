(function() {
  'use strict';

  angular.module('homeTrax.common.services.messageDialog', [
      'ui.bootstrap'
    ])
    .factory('messageDialog', messageDialog)
    .controller('messageDialogController', MessageDialogController);

  function messageDialog($uibModal) {
    var exports = {
      ask: openAskDialog,
      error: openErrorDialog
    };

    function openAskDialog(title, question) {
      return openDialog(title, question, 'app/common/services/messageDialog/templates/askDialog.html');
    }

    function openErrorDialog(title, message) {
      return openDialog(title, message, 'app/common/services/messageDialog/templates/errorDialog.html');
    }

    function openDialog(title, message, templateUrl) {
      return $uibModal.open({
        templateUrl: templateUrl,
        backdrop: 'static',
        resolve: {
          title: function() {
            return title;
          },

          message: function() {
            return message;
          }
        },
        controller: 'messageDialogController',
        controllerAs: 'controller',
        bindToController: true
      });
    }

    return exports;
  }

  function MessageDialogController(title, message) {
    this.title = title;
    this.message = message;
  }
}());
