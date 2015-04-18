(function() {
  'use strict';

  describe('financialSummaryController', function() {
    var $controllerConstructor;

    beforeEach(module('app.financial'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    function createController() {
      return $controllerConstructor('financialSummaryController', {});
    }

    it('exists', function() {
      var ctrl = createController();
      expect(ctrl).to.exist;
    });
  });
}());