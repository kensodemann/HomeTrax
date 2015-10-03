(function() {
  'use strict';

  describe('homeTrax.timesheets.current: currentTimesheetController', function() {
    var $controllerConstructor;

    beforeEach(module('homeTrax.timesheets.current'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    function createController() {
      return $controllerConstructor('currentTimesheetController', {});
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });
  });
}());