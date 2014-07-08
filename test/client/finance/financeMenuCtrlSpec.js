'use strict'

describe('financeMenuCtrl', function() {
  var scope;
  var $controllerConstructor;

  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));


  it('should exist', function(){
      var ctrl = $controllerConstructor('financeMenuCtrl', {
        $scope: scope
      });

      expect(ctrl).to.not.be.undefined;
  });

  describe('identity', function() {
    it('Should set the identity to the injected identity object', function() {
      var mockIdentity = {};

      var ctrl = $controllerConstructor('financeMenuCtrl', {
        $scope: scope,
        identity: mockIdentity
      });

      expect(scope.identity).to.equal(mockIdentity);
    });
  });
})