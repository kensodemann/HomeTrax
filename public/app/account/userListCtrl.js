angular.module('app')
  .controller('userListCtrl', ['$scope', 'user', '$modal',
    function($scope, user, $modal) {
      $scope.users = user.query();

      $scope.edit = function(user) {
        openModal(user);
      }

      $scope.create = function() {
        openModal(new user());
      };

      function openModal(model) {
        var m = $modal.open({
          templateUrl: '/partials/account/userEditor',
          controller: 'userEditorCtrl',
          backdrop: 'static',
          resolve: {
            userModel: function() {
              return model;
            }
          }
        });
      }
    }
  ])