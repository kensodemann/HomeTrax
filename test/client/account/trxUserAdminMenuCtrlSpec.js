'use strict'

describe('trxUserAdminMenuCtrl', function() {
  var scope;
  var $controllerConstructor;

  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));


  describe('identity', function() {
    it('Should set the identity to the injected identity object', function() {
      var mockIdentity = {};

      var ctrl = $controllerConstructor('trxUserAdminMenuCtrl', {
        $scope: scope,
        trxIdentity: mockIdentity
      });

      expect(scope.identity).to.equal(mockIdentity);
    });
  });
})