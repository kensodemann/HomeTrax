angular.module('app')
  .controller('userListCtrl', ['$scope', 'User', '$modal',
    function($scope, User, $modal) {
      $scope.users = User.query();

      $scope.edit = function(user) {
        openModal(user);
      }

      $scope.create = function() {
        var m = openModal(new User());
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