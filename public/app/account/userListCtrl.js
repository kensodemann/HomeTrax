angular.module('app')
  .controller('userListCtrl', ['$scope', 'user', '$modal',
    function($scope, user, $modal) {
      $scope.users = user.query();

      $scope.edit = function(user) {
        openModal(user);
      }

      $scope.create = function() {
        var m = openModal(new user());
        m.result.then(function(newUser) {
          $scope.users.push(newUser);
        });
      };

      function openModal(model) {
        return $modal.open({
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