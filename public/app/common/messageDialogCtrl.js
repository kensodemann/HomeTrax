'use strict';

angular.module('app').controller('messageDialogCtrl', ['$scope', '$modalInstance', 'messageModel',
  function ($scope, $modalInstance, messageModel){
    $scope.title = messageModel.title;
    $scope.message = messageModel.message;

    $scope.dismiss = function (){
      $modalInstance.dismiss();
    };

    $scope.yes = function(){
      $modalInstance.close(true);
    };
  }]);