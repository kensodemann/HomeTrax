angular.module('app')
  .controller('userAdminMenuCtrl', ['$scope', 'identity',
    function($scope, identity) {
      $scope.identity = identity;
    }
  ])