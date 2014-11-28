/*jshint expr: true*/
(function() {
  'use strict';

  describe('financeMenuCtrl', function() {
    var $controllerConstructor;

    var mockIdentity;

    beforeEach(module('app'));

    beforeEach(function() {
      buildMockIdentity();

      function buildMockIdentity() {
        mockIdentity = sinon.stub();
      }
    });

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    function createController() {
      return $controllerConstructor('financeMenuCtrl', {
        identity: mockIdentity
      });
    }

    it('should exist', function() {
      var ctrl = createController();
      expect(ctrl).to.not.be.undefined;
    });

    describe('identity', function() {
      it('Should set the identity to the injected identity object', function() {
        var ctrl = createController();
        expect(ctrl.identity).to.equal(mockIdentity);
      });
    });
  });
}());