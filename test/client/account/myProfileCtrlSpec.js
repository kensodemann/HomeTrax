'use strict'

describe('myProfileCtrl', function() {
  beforeEach(module('app'));

  var scope;
  var $controllerConstructor;
  var $httpBackend;
  var mockIdentiy;
  var mockModal;
  var mockNotifier;
  var mockUser;
  var userResource;
  var q;

  beforeEach(inject(function($controller, $rootScope, user, $q) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
    userResource = user;
    q = $q;

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

    mockModal = sinon.stub({
      open: function() {}
    });

    mockNotifier = sinon.stub({
      notify: function() {}
    });

    mockUser = new userResource();
    mockUser._id = '123456789009876543211234';
    mockUser.firstName = 'Jimmy';
    mockUser.lastName = 'Smith';
  }

  function createController() {
    var ctrl = $controllerConstructor('myProfileCtrl', {
      $scope: scope,
      identity: mockIdentiy,
      notifier: mockNotifier,
      $modal: mockModal
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

  describe('Changing the password', function() {
    var dfd;
    var mockModalInstance;

    beforeEach(function() {
      dfd = q.defer();
      mockModalInstance = sinon.stub({
        result: dfd.promise
      });
      mockModal.open.returns(mockModalInstance);
    });

    it('opens the modal dialog', function() {
      scope.getNewPassword();
      expect(mockModal.open.calledOnce).to.be.true;
      expect(mockModal.open.getCall(0).args[0].controller).to.equal('passwordEditorCtrl');
      expect(mockModal.open.getCall(0).args[0].templateUrl).to.equal('/partials/account/passwordEditor');
    });

    it('injects a model with the same Id as the user model', function() {
      scope.getNewPassword();
      var model = mockModal.open.getCall(0).args[0].resolve.passwordModel();
      expect(model._id).to.equal('123456789009876543211234');
    });

    it('notifies user on password chnage success', function() {
      scope.getNewPassword();
      dfd.resolve({});
      scope.$apply();

      expect(mockNotifier.notify.calledOnce).to.be.true;
      expect(mockNotifier.notify.calledWith('Password changed successfully')).to.be.true;
    });
  });
})