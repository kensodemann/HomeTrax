(function() {
  angular.module('homeTrax.common.directives.htWaitBar')
    .directive('htWaitBar', htWaitBar)
    .controller('htWaitBarController', htWaitBarController);

  function htWaitBar() {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        waiting: '='
      },
      templateUrl: 'app/common/directives/htWaitBar/htWaitBar.html',
      controller: 'htWaitBarController',
      controllerAs: 'controller',
      bindToController: true
    };
  }

  function htWaitBarController($scope, $interval) {

    var controller = this;
    controller.internalWaiting = false;

    $scope.$watch('controller.waiting', function(newVal) {
      if (newVal && !controller.stop) {
        controller.stop = $interval(function() {
            controller.internalWaiting = true;
            controller.stop = undefined;
          },

          500,
          1);
      } else if (!newVal && controller.stop) {
        interrupt(controller.stop);
      } else if (!newVal) {
        controller.internalWaiting = false;
      }
    });

    $scope.$on('$destroy', function() {
      if (controller.stop) {
        interrupt(controller.stop);
      }
    });

    function interrupt(promise) {
      $interval.cancel(promise);
      controller.stop = undefined;
      controller.internalWaiting = false;
    }
  }
})();
