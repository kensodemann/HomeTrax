angular.module('app')
  .controller('myProfileCtrl', ['$scope', 'user', 'userPassword', 'identity', '$modal', 'notifier',
    function($scope, user, userPassword, identity, $modal, notifier) {
      $scope.user = user.get({
        id: identity.currentUser._id
      });

      $scope.reset = function() {
        $scope.user = user.get({
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
              var model = new userPassword();
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