(function() {
  'use strict';

  describe('homeTrax.timesheets.list: timesheetListController', function() {
    var $controllerConstructor;

    beforeEach(module('homeTrax.timesheets.list'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    function createController() {
      return $controllerConstructor('timesheetListController', {});
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });
  });
}());