/*jshint expr: true*/
(function() {
  'use strict';

  describe('userAdminMenuCtrl', function() {
    var $controllerConstructor;

    beforeEach(module('app'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));


    describe('identity', function() {
      it('Should set the identity to the injected identity object', function() {
        var mockIdentity = {};

        var ctrl = $controllerConstructor('userAdminMenuCtrl', {
          identity: mockIdentity
        });

        expect(ctrl.identity).to.equal(mockIdentity);
      });
    });
  });
}());