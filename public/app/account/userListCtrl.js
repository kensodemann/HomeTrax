(function() {
  'use strict';

  angular.module('app').controller('userListCtrl', UserListCtrl);

  function UserListCtrl($scope, User, $modal, notifier) {
    $scope.users = User.query();

    $scope.edit = function(user) {
      initializeEditor(user, 'edit');
      openModal(user);
    };

    $scope.create = function() {
      initializeEditor('create');
      var user = new User();
      initializeEditor(user, 'create');
      openModal(user);
    };

    var modalScope = $scope.$new(true);
    var userEditor = $modal({
      template: '/partials/account/templates/userEditor',
      backdrop: 'static',
      show: false,
      scope: modalScope
    });

    modalScope.save = function() {
      copyEditedDataToResource();
      if (modalScope.mode === 'create') {
        saveNewUser();
      } else {
        updateExistingUser();
      }

      function copyEditedDataToResource() {
        modalScope.resource.firstName = modalScope.model.firstName;
        modalScope.resource.lastName = modalScope.model.lastName;
        modalScope.resource.username = modalScope.model.username;
      }

      function saveNewUser() {
        modalScope.resource.password = modalScope.model.password;
        modalScope.resource.$save(function() {
            handleSuccess('User Created Successfully');
          },
          function(reason) {
            handleError(reason);
          });
      }

      function updateExistingUser() {
        modalScope.resource.$update(function() {
          handleSuccess('User Saved Successfully');
        }, function(reason) {
          handleError(reason);
        });
      }

      function handleSuccess(msg) {
        notifier.notify(msg);
        userEditor.hide();
      }

      function handleError(reason) {
        notifier.error(reason.data);
      }
    };

    function initializeEditor(user, mode) {
      initializeScope();
      buildEditorModel(user);

      function initializeScope() {
        modalScope.mode = mode;
        modalScope.title = mode === 'edit' ? 'Edit User' : 'Create User';
        modalScope.saveLabel = mode === 'edit' ? 'Save Changes' : 'Create';
        modalScope.resource = user;
      }

      function buildEditorModel(user) {
        var model = {};
        model.firstName = user.firstName;
        model.lastName = user.lastName;
        model.username = user.username;

        modalScope.model = model;
      }
    }

    function openModal() {
      userEditor.$promise.then(function() {
        userEditor.show();
      });
    }
  }
}());