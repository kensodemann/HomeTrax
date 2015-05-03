(function() {
  'use strict';

  describe('financialDetailsController', function() {
    var $controllerConstructor;

    beforeEach(module('app.financial'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    function createController() {
      return $controllerConstructor('financialDetailsController', {});
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });
  });
}());