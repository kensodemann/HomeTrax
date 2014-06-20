'use strict'

describe('loginCtrl', function() {
  beforeEach(module('app'));

  var scope;
  var $controllerConstructor

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));

  describe('signin', function() {
    var dfd;
    var mockAuthService;
    var mockLocation;
    var mockNotifier;

    beforeEach(inject(function($q) {
      dfd = $q.defer();
      mockAuthService = sinon.stub({
        authenticateUser: function() {}
      });
      mockNotifier = sinon.stub({
        error: function() {},
        notify: function() {}
      });
      mockAuthService.authenticateUser.returns(dfd.promise);
      mockLocation = sinon.stub({
        path: function() {},
        replace: function() {}
      });
      mockLocation.path.returns(mockLocation);
    }));

    it('Should call authenticateUser', function() {
      var ctrl = $controllerConstructor('loginCtrl', {
        $scope: scope,
        $location: mockLocation,
        authService: mockAuthService,
        notifier: mockNotifier
      });
      scope.signin('jeff', 'FireW00d');

      expect(mockAuthService.authenticateUser.calledWith('jeff', 'FireW00d')).to.be.true;
    });

    it('Should redirect to index on success', function() {
      callSigninWithSuccess();

      expect(mockLocation.path.calledWith('/')).to.be.true;
      expect(mockLocation.replace.calledOnce).to.be.true;
    });

    it('Should welcome the user on success', function() {
      callSigninWithSuccess();
      expect(mockNotifier.notify.calledWith('Welcome Home!')).to.be.true;
    });

    it('Show show an error on failure', function() {
      callSigninWithFailure();
      expect(mockNotifier.error.calledWith('Login Failed!')).to.be.true;
    });

    function callSigninWithSuccess() {
      var ctrl = $controllerConstructor('loginCtrl', {
        $scope: scope,
        $location: mockLocation,
        authService: mockAuthService,
        notifier: mockNotifier
      });
      scope.signin('jeff', 'FireW00d');
      dfd.resolve(true);
      scope.$apply();
    }

    function callSigninWithFailure() {
      var ctrl = $controllerConstructor('loginCtrl', {
        $scope: scope,
        $location: mockLocation,
        authService: mockAuthService,
        notifier: mockNotifier
      });
      scope.signin('jeff', 'FireW00d');
      dfd.resolve(false);
      scope.$apply();
    }
  });
})