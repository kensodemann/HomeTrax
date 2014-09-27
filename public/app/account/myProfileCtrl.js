angular.module('app')
  .controller('myProfileCtrl', ['$scope', 'User', 'UserPassword', 'identity', '$modal', 'notifier',
    function($scope, User, UserPassword, identity, $modal, notifier) {
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
        var m = $modal.open({
          templateUrl: '/partials/account/passwordEditor',
          controller: 'passwordEditorCtrl',
          backdrop: 'static',
          resolve: {
            passwordModel: function() {
              var model = new UserPassword();
              model._id = identity.currentUser._id;
              return model;
            }
          }
        });

        m.result.then(function() {
          notifier.notify('Password changed successfully')
        });
      };
    }
  ]);