(function() {
  'use strict';

  describe('homeTrax.common.directives.htTaskTimer: htTaskTimerController', function() {
    var $controllerConstructor;

    beforeEach(module('homeTrax.common.directives.htTaskTimer'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    function createController() {
      return $controllerConstructor('htTaskTimerController', {});
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });
  });
}());