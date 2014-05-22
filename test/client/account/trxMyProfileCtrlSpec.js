'use strict'

describe('trxMyProfileCtrl', function() {
  beforeEach(module('app'));

  var scope;
  var $controllerConstructor;

  beforeEach(inject(function($controller, $rootScope, $q) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));

  function createController() {
    var ctrl = $controllerConstructor('trxMyProfileCtrl', {
      $scope: scope
    });
  }

  describe('Initialization', function() {
    beforeEach(function() {
      createController();
    });

    it('sets up a message', function() {
      expect(scope.message).to.be.a('string');
    });
  });
})