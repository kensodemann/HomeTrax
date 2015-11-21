(function() {
  'use strict';

  angular.module('homeTrax.userAdministration.passwordEditor', [
    'ui.bootstrap',
    'homeTrax.common.services.notifier',
    'homeTrax.common.resources.UserPassword'
  ]).factory('passwordEditor', passwordEditor)
    .controller('passwordEditorController', PasswordEditorController);

  function passwordEditor($uibModal) {
    return {
      open: open
    };

    function open(id) {
      return $uibModal.open({
        templateUrl: 'app/userAdministration/passwordEditor/passwordEditor.html',
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
      controller.model.$save(success, error);

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
}());