(function() {
  'use strict';

  angular.module('app').controller('calendarMenuCtrl', CalendarMenuCtrl);

  function CalendarMenuCtrl($scope, identity) {
    $scope.identity = identity;
  }
}());