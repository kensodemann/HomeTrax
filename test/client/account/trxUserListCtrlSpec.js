'use strict'

describe('trxUserListCtrl', function() {
  beforeEach(module('app'));

  var scope;
  var $controllerConstructor;
  var q;

  beforeEach(inject(function($controller, $rootScope, $q) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
    q = $q;
  }));


  describe('Initialization', function() {
    var mockUser;

    beforeEach(function() {
      mockUser = sinon.stub({
        query: function() {}
      });
    });

    it('calls the user service to get a list of users', function() {
      var ctrl = $controllerConstructor('trxUserListCtrl', {
        $scope: scope,
        trxUser: mockUser
      });
      var users = scope.users;

      expect(mockUser.query.called).to.be.true;
    });
  });

  describe('Editing Existing User', function() {
    var mockUser;
    var mockNotifier;
    var dfd;

    beforeEach(function() {
      mockNotifier = sinon.stub({
        error: function() {},
        notify: function() {}
      });
      mockUser = sinon.stub({
        query: function() {},
        $update: function() {}
      });
      dfd = q.defer();
      mockUser.$update.returns(dfd.promise);
      mockUser.username = 'fred';
      createController();
    });

    function createController() {
      var ctrl = $controllerConstructor('trxUserListCtrl', {
        $scope: scope,
        trxUser: mockUser,
        trxNotifier: mockNotifier
      });
    }

    it('Sets the mode to edit', function() {
      scope.edit(mockUser);
      expect(scope.mode).to.equal('edit');
    });

    it('Sets the user in the scope', function() {
      scope.edit(mockUser);
      expect(scope.user).to.equal(mockUser);
    });

    it('Set the editor title', function() {
      scope.edit(mockUser);
      expect(scope.editorTitle).to.equal('Edit fred');
    });

    it('calls the user service to save changes to a user', function() {
      scope.edit(mockUser);
      scope.save();
      expect(mockUser.$update.called).to.be.true;
    });

    it('clears the user on the scope if the save is successful', function(done) {
      scope.edit(mockUser);
      scope.save().then(function() {
        expect(scope.user).to.be.undefined;
        expect(scope.editorTitle).to.be.undefined;
        done();
      });
      dfd.resolve();
      scope.$apply();
    });

    it('does not clear the user on the scope if the save is not successful', function(done) {
      scope.edit(mockUser);
      scope.save().then(function() {
        expect(scope.user).to.equal(mockUser);
        expect(scope.editorTitle).to.equal('Edit fred');
        done();
      });
      dfd.reject({
        data: {
          reason: 'you are a failure'
        }
      });
      scope.$apply();
    });

    it('does not show a notification if the update was successful', function(done) {
      scope.edit(mockUser);
      scope.save().then(function() {
        expect(mockNotifier.error.called).to.be.false;
        expect(mockNotifier.notify.called).to.be.false;
        done();
      });
      dfd.resolve();
      scope.$apply();
    });

    it('shows an error notification if the update failed', function(done) {
      scope.edit(mockUser);
      scope.save().then(function() {
        expect(mockNotifier.error.calledWith('Update Failed: you are a failure')).to.be.true;
        expect(mockNotifier.notify.called).to.be.false;
        done();
      });
      dfd.reject({
        data: {
          reason: 'you are a failure'
        }
      });
      scope.$apply();
    });

    it('clears the user on the scope if the edit is cancelled', function() {
      scope.edit(mockUser);
      scope.cancel();
      expect(mockUser.$update.called).to.be.false;
      expect(scope.user).to.be.undefined;
      expect(scope.editorTitle).to.be.undefined;
    });
  });

  describe('Creating New User', function() {
    var mockNotifier;
    var $httpBackend;

    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', '/api/users').respond([{
        username: 'userX'
      }, {
        username: 'xxx'
      }]);
    }));

    beforeEach(function() {
      mockNotifier = sinon.stub({
        error: function() {},
        notify: function() {}
      });
      createController();
    });

    function createController() {
      var ctrl = $controllerConstructor('trxUserListCtrl', {
        $scope: scope,
        trxNotifier: mockNotifier
      });
    }

    it('Sets the mode to create', function() {
      scope.create();
      expect(scope.mode).to.equal('create');
    });

    it('Sets the user to a new user', function() {
      scope.create();
      expect(scope.user).to.be.a('object');
    });

    it('Set the editor title', function() {
      scope.create();
      expect(scope.editorTitle).to.equal('New User');
    });

    it('clears the user on the scope if the save is successful', function() {
      $httpBackend.expectPOST('/api/users', {}).respond(201, {});
      scope.create();
      scope.save();
      $httpBackend.flush();
      expect(scope.user).to.be.undefined;
      expect(scope.editorTitle).to.be.undefined;
    });

    it('does not clear the user on the scope if the save is not successful', function() {
      $httpBackend.expectPOST('/api/users', {}).respond(400, {
        reason: 'you are a failure'
      });
      scope.create();
      scope.save();
      $httpBackend.flush();
      expect(scope.user).to.be.a('Object');
      expect(scope.editorTitle).to.equal('New User');
    });

    it('does not show a notification if the save was successful', function() {
      $httpBackend.expectPOST('/api/users', {}).respond(201, {});
      scope.create();
      scope.save();
      $httpBackend.flush();
      expect(mockNotifier.error.called).to.be.false;
      expect(mockNotifier.notify.called).to.be.false;
    });

    it('shows an error notification if the update failed', function() {
      $httpBackend.expectPOST('/api/users', {}).respond(400, {
        reason: 'you are a failure'
      });
      scope.create();
      scope.save();
      $httpBackend.flush();
      expect(mockNotifier.error.calledWith('Create New User Failed: you are a failure')).to.be.true;
      expect(mockNotifier.notify.called).to.be.false;
    });

    it('clears the user on the scope if the edit is cancelled', function() {
      scope.create();
      scope.cancel();
      expect(scope.user).to.be.undefined;
      expect(scope.editorTitle).to.be.undefined;
    });
  });
})