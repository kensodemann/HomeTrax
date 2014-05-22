'use strict'

describe('trxMyProfileCtrl', function() {
  beforeEach(module('app'));

  var scope;
  var $controllerConstructor;

  beforeEach(inject(function($controller, $rootScope, $q) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));

  describe('Initialization', function() {
    beforeEach(function() {
      createController();
    });

    function createController() {
      var ctrl = $controllerConstructor('trxMyProfileCtrl', {
        $scope: scope
      });
    }
  });

  describe('Changing the password', function() {
    var mockIdentiy;

    beforeEach(function() {
      mockIdentiy = sinon.stub({
        currentUser: {
          _id: 123456789
        }
      });
      createController();
    });

    function createController() {
      var ctrl = $controllerConstructor('trxMyProfileCtrl', {
        $scope: scope,
        trxIdentity: mockIdentiy
      });
    }

    it('sets the user data', function() {
      scope.setPassword();
      expect(scope.passwordData._id).to.equal(123456789);
    });

    it('clears the user data on cancel', function() {
      scope.setPassword();
      scope.cancelPasswordChange();
      expect(scope.passwordData).to.be.undefined;
    });
  });
})