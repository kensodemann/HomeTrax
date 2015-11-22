(function() {
  'use strict';

  describe('homeTrax.auth.login: loginController', function() {
    beforeEach(module('homeTrax.auth.login'));

    var scope;
    var $controllerConstructor;
    var dfd;
    var mockAuthService;
    var mockLocation;
    var mockNotifier;

    beforeEach(inject(function($controller, $rootScope, $q) {
      scope = $rootScope.$new();
      $controllerConstructor = $controller;
      dfd = $q.defer();
    }));

    beforeEach(function() {
      mockAuthService = sinon.stub({
        authenticateUser: function() {
        }
      });
      mockNotifier = sinon.stub({
        error: function() {
        },

        notify: function() {
        }
      });
      mockAuthService.authenticateUser.returns(dfd.promise);
      mockLocation = sinon.stub({
        path: function() {
        },

        replace: function() {
        }
      });
      mockLocation.path.returns(mockLocation);
    });

    function createController(){
      return $controllerConstructor('loginController', {
        $location: mockLocation,
        authService: mockAuthService,
        notifier: mockNotifier
      });
    }

    describe('signin', function() {
      var controller;
      beforeEach(function(){
        controller = createController();
      });

      it('Should call authenticateUser', function() {
        controller.signin('jeff', 'FireW00d');
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