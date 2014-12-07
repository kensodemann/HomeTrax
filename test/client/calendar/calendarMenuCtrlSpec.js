/*jshint expr: true*/
(function() {
  'use strict';

  describe('calendarMenuCtrl', function() {
    var $controllerConstructor;

    var mockIdentity;

    beforeEach(module('app.calendar'));

    beforeEach(function(){
      mockIdentity = {};
    });

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    function createController (){
      return $controllerConstructor('calendarMenuCtrl', {
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