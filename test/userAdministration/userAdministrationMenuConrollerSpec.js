(function() {
  'use strict';

  describe('userAdminMenuCtrl', function() {
    var $controllerConstructor;

    beforeEach(module('homeTrax.userAdministration'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));


    describe('identity', function() {
      it('Should set the identity to the injected identity object', function() {
        var mockIdentity = {};

        var controller = $controllerConstructor('userAdministrationMenuController', {
          identity: mockIdentity
        });

        expect(controller.identity).to.equal(mockIdentity);
      });
    });
  });
}());