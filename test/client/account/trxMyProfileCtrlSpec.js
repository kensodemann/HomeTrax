'use strict'

describe('trxMyProfileCtrl', function() {
  beforeEach(module('app'));

  var scope;
  var $controllerConstructor;
  var $httpBackend;
  var mockIdentiy;
  var mockNotifier;
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

    mockNotifier = sinon.stub({
      error: function() {},
      notify: function() {}
    });

    mockUser = new userResource();
    mockUser._id = '123456789009876543211234';
    mockUser.firstName = 'Jimmy';
    mockUser.lastName = 'Smith';
  }

  function createController() {
    var ctrl = $controllerConstructor('trxMyProfileCtrl', {
      $scope: scope,
      trxIdentity: mockIdentiy,
      trxNotifier: mockNotifier
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
      $httpBackend.expectPUT('/api/users/' + mockUser._id, mockUser).respond(200, mockUser);
      scope.save();
      $httpBackend.flush();
    });
  });

  describe('Password Change Handler', function() {
    it('sets flag true if passwords match and are valid', function() {
      scope.getNewPassword();
      scope.passwordData.newPassword = 'firebird';
      scope.passwordData.verifyPassword = 'firebird';
      scope.passwordEntryChanged();

      expect(scope.newPasswordIsValid).to.be.true;
      expect(scope.newPasswordErrorMessage).to.equal('');
    });

    it('sets flag false if passwords do not match', function() {
      scope.getNewPassword();
      scope.passwordData.newPassword = 'firebird';
      scope.passwordData.verifyPassword = 'pheonix';
      scope.passwordEntryChanged();

      expect(scope.newPasswordIsValid).to.be.false;
      expect(scope.newPasswordErrorMessage).to.equal('Passwords do not match');
    });
  });

  describe('Changing the password', function() {
    beforeEach(function() {

    });


    it('Initializes password validity flag and message', function() {
      scope.getNewPassword();
      expect(scope.newPasswordIsValid).to.be.false;
      expect(scope.newPasswordErrorMessage).to.equal('New password must be at least 8 characters long');
    });

    it('sets the password data', function() {
      scope.getNewPassword();
      expect(scope.passwordData._id).to.equal('123456789009876543211234');
    });

    it('clears the password data on cancel', function() {
      scope.getNewPassword();
      scope.cancelPasswordChange();
      expect(scope.passwordData).to.be.undefined;
    });

    it('puts the data', function() {
      scope.getNewPassword();
      $httpBackend.expectPUT('/api/changepassword/' + mockUser._id, scope.passwordData).respond(200, mockUser);
      scope.changePassword();
      $httpBackend.flush();
    });

    it('clears the password data on success', function() {
      scope.getNewPassword();
      $httpBackend.expectPUT('/api/changepassword/' + mockUser._id, scope.passwordData).respond(200, mockUser);
      scope.changePassword();
      $httpBackend.flush();
      expect(scope.passwordData).to.be.undefined;
      expect(scope.newPasswordErrorMessage).to.equal('');
      expect(mockNotifier.notify.calledOnce).to.be.true;
      expect(mockNotifier.error.called).to.be.false;
    });

    it('shows an error on failure', function() {
      scope.getNewPassword();
      $httpBackend.expectPUT('/api/changepassword/' + mockUser._id, scope.passwordData).respond(400, {
        reason: 'you are a failure'
      });
      scope.changePassword();
      $httpBackend.flush();
      expect(scope.passwordData).to.not.be.undefined;
      expect(scope.newPasswordErrorMessage).to.equal('ERROR: you are a failure');
      expect(mockNotifier.notify.called).to.be.false;
      expect(mockNotifier.error.calledOnce).to.be.true;
    });
  });
})