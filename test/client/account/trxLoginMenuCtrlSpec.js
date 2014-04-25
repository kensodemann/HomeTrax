'use strict'

describe('trxLoginMenuCtrl', function() {
  var scope;
  var $controllerConstructor;

  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope){
  	scope = $rootScope.$new();
  	$controllerConstructor = $controller;
  }));
  

  it('Should set the identity to the injected identity object', inject(function($controller, $rootScope) {
    var mockIdentity = {};

    var ctrl = $controllerConstructor('trxLoginMenuCtrl', {
      $scope: scope,
      trxIdentity: mockIdentity,
      trxAuthentication: {},
      $location: {}
    });

    expect(scope.identity).to.equal(mockIdentity);
  }));

})
