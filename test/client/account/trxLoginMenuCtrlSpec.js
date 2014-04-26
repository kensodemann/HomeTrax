'use strict'

describe('trxLoginMenuCtrl', function() {
  var scope;
  var $controllerConstructor;

  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));


  describe('identity', function() {
    it('Should set the identity to the injected identity object', function() {
      var mockIdentity = {};

      var ctrl = $controllerConstructor('trxLoginMenuCtrl', {
        $scope: scope,
        trxIdentity: mockIdentity,
        trxAuthentication: {},
        $location: {}
      });

      expect(scope.identity).to.equal(mockIdentity);
    });
  });


  describe('logout', function() {
    var dfd;
    var mockAuth;

    beforeEach(inject(function($q) {
      dfd = $q.defer();
      mockAuth = sinon.stub({
        logoutUser: function() {}
      });
      mockAuth.logoutUser.returns(dfd.promise);
    }));

    it('Should call trxAuthentication.logoutUser()', function() {
      var ctrl = $controllerConstructor('trxLoginMenuCtrl', {
        $scope: scope,
        trxIdentity: {},
        trxAuthentication: mockAuth,
        $location: {}
      });
      scope.logout();

      expect(mockAuth.logoutUser.calledOnce).to.be.true;
    });

    it('Should redict to the login page', function() {
      var mockLocation = sinon.stub({
        path: function() {}
      });

      var ctrl = $controllerConstructor('trxLoginMenuCtrl', {
        $scope: scope,
        trxIdentity: {},
        trxAuthentication: mockAuth,
        $location: mockLocation
      });
      scope.logout();
      dfd.resolve();
      scope.$digest();

      expect(mockLocation.path.calledWith('/login')).to.be.true;
    });
  });
})