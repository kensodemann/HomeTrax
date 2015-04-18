(function() {
  'use strict';

  describe('financialMenuController', function() {
    var mockIdentity;
    var $controllerConstructor;

    beforeEach(module('app.financial'));

    beforeEach(function() {
      mockIdentity = {};
    });

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    function createController() {
      return $controllerConstructor('financialMenuController', {
        identity: mockIdentity
      });
    }

    it('exists', function() {
      var ctrl = createController();
      expect(ctrl).to.exist;
    });

    describe('initialization', function() {
      it('sets the identity', function() {
        var ctrl = createController();
        expect(ctrl.identity).to.equal(mockIdentity);
      });
    });
  });
}());