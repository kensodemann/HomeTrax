/* global beforeEach describe expect inject it sinon */
(function() {
  'use strict';

  describe('householdCtrl', function() {
    beforeEach(module('app.household'));

    var controllerConstructor;

    beforeEach(inject(function($controller) {
      controllerConstructor = $controller;
    }));

    function createController() {
      return controllerConstructor('householdCtrl', {});
    }

    it('exists', function() {
      var ctrl = createController();
      expect(ctrl).to.not.be.undefined;
    });
  });
})();