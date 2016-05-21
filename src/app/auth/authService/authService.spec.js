/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.auth.authService', function() {
    var identity;

    var authService;
    var authToken;
    var config;
    var $httpBackend;

    beforeEach(module('homeTrax.auth.authService'));

    beforeEach(inject(function(_$httpBackend_, _config_, _authService_, _authToken_, _identity_) {
      config = _config_;
      authService = _authService_;
      $httpBackend = _$httpBackend_;
      authToken = _authToken_;
      identity = _identity_;
    }));

    beforeEach(function() {
      sinon.stub(authToken, 'set');
      sinon.stub(authToken, 'clear');
    });

    beforeEach(function() {
      $httpBackend.whenGET(/.*currentUser.*/).respond(200, {});
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    afterEach(function() {
      authToken.set.restore();
      authToken.clear.restore();
    });

    describe('authenticateUser', function() {
      beforeEach(function() {
        sinon.stub(identity, 'set');
      });

      afterEach(function() {
        identity.set.restore();
      });

      it('posts the username and password', function() {
        $httpBackend.expectPOST(config.dataService + '/login', {
          username: 'jimmy',
          password: 'CrakzKorn'
        }).respond({});
        authService.authenticateUser('jimmy', 'CrakzKorn');
        $httpBackend.flush();
      });

      describe('successful login', function() {
        beforeEach(function() {
          $httpBackend.expectPOST(config.dataService + '/login', {
            username: 'jimmy',
            password: 'CrakzKorn'
          }).respond({
            success: true,
            user: {
              firstName: 'James',
              lastName: 'Jones'
            },
            token: 'IAmToken'
          });
        });

        it('resolves true and sets the identity', function() {
          var success = false;
          authService.authenticateUser('jimmy', 'CrakzKorn').then(function(result) {
            success = result;
          });

          $httpBackend.flush();
          expect(success).to.be.true;
          expect(identity.set.calledOnce).to.be.true;
          expect(identity.set.calledWith({
            firstName: 'James',
            lastName: 'Jones'
          })).to.be.true;
        });

        it('saves the login token', function() {
          authService.authenticateUser('jimmy', 'CrakzKorn');
          $httpBackend.flush();
          expect(authToken.set.calledOnce).to.be.true;
          expect(authToken.set.calledWith('IAmToken')).to.be.true;
        });
      });

      describe('failed login', function() {
        beforeEach(function() {
          $httpBackend.expectPOST(config.dataService + '/login', {
            username: 'jimmy',
            password: 'CrakzKorn'
          }).respond({
            success: false
          });
        });

        it('resolves false and does not set the identity if login fails', function() {
          var success = true;
          authService.authenticateUser('jimmy', 'CrakzKorn').then(function(result) {
            success = result;
          });

          $httpBackend.flush();
          expect(success).to.be.false;
          expect(identity.set.called).to.be.false;
        });

        it('clears any existing login token if the login fails', function() {
          authService.authenticateUser('jimmy', 'CrakzKorn');
          $httpBackend.flush();
          expect(authToken.clear.calledOnce).to.be.true;
        });
      });
    });

    describe('logoutUser', function() {
      beforeEach(function() {
        $httpBackend.expectPOST(config.dataService + '/logout', {
          logout: true
        }).respond();
      });

      beforeEach(function() {
        sinon.stub(identity, 'clear');
      });

      afterEach(function() {
        identity.clear.restore();
      });

      it('posts to the logout endpoint', function() {
        authService.logoutUser();
        $httpBackend.flush();
      });

      it('clears the auth token', function() {
        authService.logoutUser();
        $httpBackend.flush();
        expect(authToken.clear.calledOnce).to.be.true;
      });

      it('Returns a promise', function() {
        var p = authService.logoutUser();
        expect(p.then).to.be.a('function');
        $httpBackend.flush();
      });

      it('Clears the current user when logout complete', function() {
        authService.logoutUser();
        expect(identity.clear.called).to.be.false;
        $httpBackend.flush();
        expect(identity.clear.calledOnce).to.be.true;
      });
    });

    describe('refreshing', function() {
      it('refreshes the token', function() {
        $httpBackend.expectGET(config.dataService + '/freshLoginToken').respond({
          success: true,
          token: 'IAmNewToken'
        });
        authService.refreshLogin();
        $httpBackend.flush();
        expect(authToken.set.calledOnce).to.be.true;
        expect(authToken.set.calledWith('IAmNewToken')).to.be.true;
      });
    });
  });
}());
