(function() {
  'use strict';

  describe('loginMenuCtrl', function() {
    var scope;
    var $controllerConstructor;

    var dfd;
    var mockAuthService;
    var mockIdentity;
    var mockLocation;

    beforeEach(module('homeTrax.auth'));

    beforeEach(inject(function($controller, $rootScope, $q) {
      scope = $rootScope.$new();
      $controllerConstructor = $controller;
      dfd = $q.defer();
    }));

    beforeEach(function() {
      mockAuthService = sinon.stub({
        logoutUser: function() {
        }
      });
      mockAuthService.logoutUser.returns(dfd.promise);
      mockIdentity = sinon.stub();
      mockLocation = sinon.stub({
        path: function() {
        }
      });
    });

    function createController() {
      return $controllerConstructor('loginMenuController', {
        identity: mockIdentity,
        authService: mockAuthService,
        $location: mockLocation
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

        expect(mockLocation.path.calledWith('/login')).to.be.true;
      });
    });
  });
}());