'use strict'

describe('trxLoginCtrl', function() {
  beforeEach(module('app'));

  var scope;
  var $controllerConstructor

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));

  describe('signin', function() {
    var dfd;
    var mockAuth;

    beforeEach(inject(function($q) {
      dfd = $q.defer();
      mockAuth = sinon.stub({
        authenticateUser: function() {}
      });
      mockAuth.authenticateUser.returns(dfd.promise);
    }));

    it('It should call authenticateUser', function() {
      var ctrl = $controllerConstructor('trxLoginCtrl', {
        $scope: scope,
        $location: {},
        trxAuthentication: mockAuth
      });
      scope.signin('jeff', 'FireW00d');

      expect(mockAuth.authenticateUser.calledWith('jeff', 'FireW00d')).to.be.true;
    });
  });
})