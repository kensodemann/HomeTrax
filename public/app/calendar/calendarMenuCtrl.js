'use strict'

angular.module('app')
  .controller('calendarMenuCtrl', ['$scope', 'identity',
    function($scope, identity) {
      $scope.identity = identity;
    }
  ]);