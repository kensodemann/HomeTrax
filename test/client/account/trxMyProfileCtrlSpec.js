'use strict'

describe('trxMyProfileCtrl', function() {
  beforeEach(module('app'));

  var scope;
  var $controllerConstructor;
  var $httpBackend;
  var mockIdentiy;
  var mockUser;
  var userResource;

  beforeEach(inject(function($controller, $rootScope, trxUser) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
    userResource = trxUser;

    createMocks();
    createController();
  }));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', '/api/users/123456789009876543211234').respond(mockUser);
    $httpBackend.flush();
  }));

  function createMocks() {
    mockIdentiy = sinon.stub({
      currentUser: {
        _id: '123456789009876543211234'
      }
    });

    mockUser = new userResource();
    mockUser._id = '123456789009876543211234';
    mockUser.firstName = 'Jimmy';
    mockUser.lastName = 'Smith';
  }

  function createController() {
    var ctrl = $controllerConstructor('trxMyProfileCtrl', {
      $scope: scope,
      trxIdentity: mockIdentiy
    });
  }

  describe('Initialization', function() {
    it('Gets the currently logged in user', function() {
      expect(scope.user.firstName).to.equal('Jimmy');
      expect(scope.user.lastName).to.equal('Smith');
    });
  });

  describe('Reset', function() {
    it('Gets the data for the currently logged in user', function() {
      scope.user.firstName = 'Bengie';
      scope.user.lastName = 'Frankfurter';

      scope.reset();
      $httpBackend.flush();

      expect(scope.user.firstName).to.equal('Jimmy');
      expect(scope.user.lastName).to.equal('Smith');
    });
  });

  describe('Save', function() {
    it('puts the data', function() {
      $httpBackend.expectPUT('/api/users/' + mockUser._id, mockUser).respond(201, mockUser);
      scope.save();
      $httpBackend.flush();
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