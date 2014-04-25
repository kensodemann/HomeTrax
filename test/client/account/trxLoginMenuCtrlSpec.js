'use strict'

describe('trxLoginMenuCtrl', function() {
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

      var ctrl = $controllerConstructor('trxLoginMenuCtrl', {
        $scope: scope,
        trxIdentity: mockIdentity,
        trxAuthentication: {},
        $location: {}
      });

      expect(scope.identity).to.equal(mockIdentity);
    });
  });


  describe('logout', function(){
  	it('Should call trxAuthentication.logoutUser()', function(){

  	});

  	it('Should redict to the login page', function(){

  	});
  });
})