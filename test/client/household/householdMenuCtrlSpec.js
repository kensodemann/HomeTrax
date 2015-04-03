/* global beforeEach describe expect inject it */
(function() {
  'use strict';

  describe('householdMenuCtrl', function() {
    var controllerConstructor;
    var mockIdentity;

    beforeEach(module('app.household'));

    beforeEach(inject(function($controller) {
      controllerConstructor = $controller;
    }));

    beforeEach(function() {
      mockIdentity = {};
    });

    function createController() {
      return controllerConstructor('householdMenuCtrl', {
        identity: mockIdentity
      });
    }

    it('exists', function() {
      var ctrl = createController();
      expect(ctrl).to.not.be.undefined;
    });

    describe('initialization', function() {
      it('sets the identity', function() {
        var ctrl = createController();
        expect(ctrl.identity).to.equal(mockIdentity);
      });
    });
  });
}());