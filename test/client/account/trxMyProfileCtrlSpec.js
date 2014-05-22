'use strict'

describe('trxMyProfileCtrl', function() {
  beforeEach(module('app'));

  var scope;
  var $controllerConstructor;
  var mockUser;
  var mockIdentiy;

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;

    createMocks();
    createController();
  }));

  function createMocks() {
    mockUser = sinon.stub({
      get: function() {}
    });
    mockIdentiy = sinon.stub({
      currentUser: {
        _id: '123456789009876543211234'
      }
    });
  }

  function createController() {
    var ctrl = $controllerConstructor('trxMyProfileCtrl', {
      $scope: scope,
      trxUser: mockUser,
      trxIdentity: mockIdentiy
    });
  }

  describe('Initialization', function() {
    it('Gets the currently logged in user', function() {
      expect(mockUser.get.calledWith({
        id: mockIdentiy.currentUser._id
      })).to.be.true;
    });
  });

  describe('Changing the password', function() {
    it('sets the user data', function() {
      scope.setPassword();
      expect(scope.passwordData._id).to.equal('123456789009876543211234');
    });

    it('clears the user data on cancel', function() {
      scope.setPassword();
      scope.cancelPasswordChange();
      expect(scope.passwordData).to.be.undefined;
    });
  });
})