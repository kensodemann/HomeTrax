(function() {
  'use strict';

  angular.module('homeTrax.common.directives.htTaskTimer', [
      'homeTrax.common.filters.hoursMinutes'
    ])
    .directive('htTaskTimer', htTaskTimer)
    .controller('htTaskTimerController', HtTaskTimerController);

  function htTaskTimer() {
    return {
      restrict: 'AE',
      scope: {
        htTimer: '=',
        htAllTimer: '=',
        htEdit: '&',
        htStart: '&',
        htStop: '&'
      },
      templateUrl: 'app/common/directives/htTaskTimer/htTaskTimer.html',
      controller: 'htTaskTimerController',
      controllerAs: 'controller',
      bindToController: true
    };
  }

  function HtTaskTimerController() {
  }
}());
