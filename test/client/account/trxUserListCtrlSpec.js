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


  describe('users', function() {
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

  describe('editing existing user', function() {
    var mockUser;
    var dfd;

    beforeEach(function() {
      mockUser = sinon.stub({
        query: function() {},
        $update: function() {}
      });
      dfd = q.defer();
      mockUser.$update.returns(dfd.promise);
      createController();
    });

    function createController() {
      var ctrl = $controllerConstructor('trxUserListCtrl', {
        $scope: scope,
        trxUser: mockUser
      });
    }

    it('Sets the user in the scope', function() {
      scope.edit(mockUser);
      expect(scope.user).to.equal(mockUser);
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
        done();
      });
      dfd.resolve();
      scope.$apply();
    });

    it('does not clear the user on the scope if the save is not successful', function(done) {
      scope.edit(mockUser);
      scope.save().then(function() {
        expect(scope.user).to.equal(mockUser);
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
    });
  });

})