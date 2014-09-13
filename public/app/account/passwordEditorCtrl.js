'use strict';

angular.module('app')
  .controller('passwordEditorCtrl', ['$scope', '$modalInstance', 'passwordModel',
    function($scope, $modalInstance, passwordModel) {
      $scope.model = passwordModel;
      $scope.errorMessage = '';

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

      $scope.ok = function() {
        $scope.model.$update(function() {
          $modalInstance.close();
        }, function(response) {
          $scope.errorMessage = response.data.reason;
        });
      };
    }
  ]);