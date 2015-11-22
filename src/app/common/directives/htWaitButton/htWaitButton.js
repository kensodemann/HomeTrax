(function() {
  angular.module('homeTrax.common.directives.htWaitButton', [])
    .directive('htWaitButton', HtWaitButton)
    .controller('htWaitButtonController', HtWaitButtonController);

  function HtWaitButton() {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        waitClick: '&',
        waitBusy: '=?'
      },
      templateUrl: 'app/common/directives/htWaitButton/htWaitButton.html',
      controller: 'htWaitButtonController',
      controllerAs: 'controller',
      bindToController: true
    };
  }

  function HtWaitButtonController($q) {

    var controller = this;

    controller.waitBusy = false;
    controller.transStyle = {
      visibility: 'visible'
    };
    controller.click = click;

    function click() {
      setBusy(true);
      var promise;
      try {
        promise = controller.waitClick();
      } catch (e) {
        setBusy(false);
        throw e;
      }

      $q.when(promise).then(function() {
        setBusy(false);
      }, function() {

        setBusy(false);
      });
    }

    function setBusy(busyVal) {
      controller.waitBusy = busyVal;
      controller.transStyle.visibility = controller.waitBusy ? 'hidden' : 'visible';
    }
  }

})();
