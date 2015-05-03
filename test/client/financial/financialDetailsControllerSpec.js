(function() {
  'use strict';

  describe('financialDetailsController', function() {
    var $controllerConstructor;
    var mockRouteParams;

    beforeEach(module('app.financial'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    beforeEach(function() {
      mockRouteParams = {};
    });

    function createController() {
      return $controllerConstructor('financialDetailsController', {
        $routeParams: mockRouteParams
      });
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });
  });
}());