(function() {
  'use strict';

  angular.module('app').controller('myProfileCtrl', MyProfileCtrl);

  function MyProfileCtrl($scope, User, UserPassword, identity, $modal, notifier) {
    $scope.user = User.get({
      id: identity.currentUser._id
    });

    $scope.reset = function() {
      $scope.user = User.get({
        id: identity.currentUser._id
      });
    };

    $scope.save = function() {
      $scope.user.$update();
    };

    $scope.getNewPassword = function() {
      $scope.passwordModel = new UserPassword();
      $scope.passwordModel._id = identity.currentUser._id;

      passwordEditor.$promise.then(function() {
        passwordEditor.show();
      });
    };

    $scope.setPassword = function() {
      $scope.passwordModel.$update(function() {
        notifier.notify('Password changed successfully');
        passwordEditor.hide();
      }, function(reason) {
        $scope.errorMessage = reason.data.reason;
        notifier.error(reason.data.reason);
      });
    };

    var passwordEditor = $modal({
      template: '/partials/account/templates/passwordEditor',
      backdrop: 'static',
      show: false,
      scope: $scope
    });
  }
}());