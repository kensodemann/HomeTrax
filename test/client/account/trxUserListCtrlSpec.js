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

  describe('update', function() {
    var mockUser;
    var dfdUpdate;

    beforeEach(function() {
      mockUser = sinon.stub({
        query: function() {},
        $update: function() {}
      });
      dfdUpdate = q.defer();
      mockUser.$update.returns(dfdUpdate.promise);
    });

    it('calls the user service to save changes to a user', function() {
      var ctrl = $controllerConstructor('trxUserListCtrl', {
        $scope: scope,
        trxUser: mockUser
      });
      scope.update(mockUser);

      expect(mockUser.$update.called).to.be.true;
    });
  });

})