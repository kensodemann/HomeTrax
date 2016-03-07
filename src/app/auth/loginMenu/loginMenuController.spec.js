/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.auth.loginMenu: loginMenuController', function() {
    var scope;
    var $controllerConstructor;

    var dfd;
    var mockAuthService;
    var mockIdentity;
    var mockState;

    beforeEach(module('homeTrax.auth.loginMenu'));

    beforeEach(inject(function($controller, $rootScope, $q) {
      scope = $rootScope.$new();
      $controllerConstructor = $controller;
      dfd = $q.defer();
    }));

    beforeEach(function() {
      mockAuthService = sinon.stub({
        logoutUser: function() {}
      });
      mockAuthService.logoutUser.returns(dfd.promise);
      mockIdentity = sinon.stub();
      mockState = sinon.stub({
        go: function() {}
      });
    });

    function createController() {
      return $controllerConstructor('loginMenuController', {
        identity: mockIdentity,
        authService: mockAuthService,
        $state: mockState
      });
    }


    describe('identity', function() {
      it('Should set the identity to the injected identity object', function() {
        var controller = createController();
        expect(controller.identity).to.equal(mockIdentity);
      });
    });


    describe('logout', function() {
      it('Should call authService.logoutUser()', function() {
        var controller = createController();
        controller.logout();
        expect(mockAuthService.logoutUser.calledOnce).to.be.true;
      });

      it('Should redirect to the login page', function() {
        var controller = createController();
        controller.logout();
        dfd.resolve();
        scope.$digest();

        expect(mockState.go.calledOnce).to.be.true;
        expect(mockState.go.calledWith('app.login')).to.be.true;
      });
    });
  });
}());