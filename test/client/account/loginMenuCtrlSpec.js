'use strict'

describe('loginMenuCtrl', function() {
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

      var ctrl = $controllerConstructor('loginMenuCtrl', {
        $scope: scope,
        identity: mockIdentity,
        authService: {},
        $location: {}
      });

      expect(scope.identity).to.equal(mockIdentity);
    });
  });


  describe('logout', function() {
    var dfd;
    var mockAuthService;

    beforeEach(inject(function($q) {
      dfd = $q.defer();
      mockAuthService = sinon.stub({
        logoutUser: function() {}
      });
      mockAuthService.logoutUser.returns(dfd.promise);
    }));

    it('Should call authService.logoutUser()', function() {
      var ctrl = $controllerConstructor('loginMenuCtrl', {
        $scope: scope,
        identity: {},
        authService: mockAuthService,
        $location: {}
      });
      scope.logout();

      expect(mockAuthService.logoutUser.calledOnce).to.be.true;
    });

    it('Should redict to the login page', function() {
      var mockLocation = sinon.stub({
        path: function() {}
      });

      var ctrl = $controllerConstructor('loginMenuCtrl', {
        $scope: scope,
        identity: {},
        authService: mockAuthService,
        $location: mockLocation
      });
      scope.logout();
      dfd.resolve();
      scope.$apply();

      expect(mockLocation.path.calledWith('/login')).to.be.true;
    });
  });
})