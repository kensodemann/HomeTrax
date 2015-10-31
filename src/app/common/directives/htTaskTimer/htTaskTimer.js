(function() {
  'use strict';

  angular.module('homeTrax.common.directives.htTaskTimer')
    .directive('htTaskTimer', htTaskTimer)
    .controller('htTaskTimerController', HtTaskTimerController);

  function htTaskTimer() {
    return {
      restrict: 'AE',
      scope: {
        htTimer: '=',
        htAllTimer: '=',
        htEdit:'&'
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
