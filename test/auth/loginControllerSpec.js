(function() {
  'use strict';

  describe('homeTrax.auth.login: loginController', function() {
    beforeEach(module('homeTrax.auth.login'));

    var scope;
    var $controllerConstructor;
    var dfd;
    var mockAuthService;
    var mockState;
    var mockNotifier;

    beforeEach(inject(function($controller, $rootScope, $q) {
      scope = $rootScope.$new();
      $controllerConstructor = $controller;
      dfd = $q.defer();
    }));

    beforeEach(function() {
      mockAuthService = sinon.stub({
        authenticateUser: function() {}
      });
      mockNotifier = sinon.stub({
        error: function() {},

        notify: function() {}
      });
      mockAuthService.authenticateUser.returns(dfd.promise);
      mockState = sinon.stub({
        go: function() {}
      });
    });

    function createController() {
      return $controllerConstructor('loginController', {
        $state: mockState,
        authService: mockAuthService,
        notifier: mockNotifier
      });
    }

    describe('signin', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
      });

      it('Should call authenticateUser', function() {
        controller.signin('jeff', 'FireW00d');
        expect(mockAuthService.authenticateUser.calledWith('jeff', 'FireW00d')).to.be.true;
      });

      it('Should redirect to index on success', function() {
        callSigninWithSuccess();

        expect(mockState.go.calledOnce).to.be.true;
        expect(mockState.go.calledWith('app.main')).to.be.true;
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
        controller.signin('jeff', 'FireW00d');
        dfd.resolve(true);
        scope.$apply();
      }

      function callSigninWithFailure() {
        controller.signin('jeff', 'FireW00d');
        dfd.resolve(false);
        scope.$apply();
      }
    });
  });
}());