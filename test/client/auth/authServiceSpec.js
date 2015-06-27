(function() {
  'use strict';

  describe('authService', function() {
    var mockAuthToken;
    var mockHttp;
    var mockIdentity;
    var mockUser;
    var dfd;
    var serviceUnderTest;
    var scope;

    beforeEach(module('app.auth'));

    beforeEach(function() {
      mockAuthToken = sinon.stub({
        clear: function() {},
        set: function() {}
      });
      mockHttp = sinon.stub({
        post: function() {
        }
      });
      mockIdentity = sinon.stub({
        isAuthenticated: function() {
        },
        isAuthorized: function() {
        }
      });
      mockUser = sinon.stub().returns({});

      module(function($provide) {
        $provide.value('$http', mockHttp);
        $provide.value('identity', mockIdentity);
        $provide.value('User', mockUser);
        $provide.value('authToken', mockAuthToken);
      });
    });

    beforeEach(inject(function($rootScope, $q, authService) {
      scope = $rootScope;
      dfd = $q.defer();
      mockHttp.post.returns(dfd.promise);
      serviceUnderTest = authService;
    }));

    describe('authenticateUser', function() {
      it('Returns a promise', function() {
        var p = serviceUnderTest.authenticateUser('jimmy', 'CrackCornz');
        expect(p.then).to.be.a('function');
      });

      it('Calls post, passing username and password', function() {
        serviceUnderTest.authenticateUser('jimmy', 'CrakzKorn');
        expect(mockHttp.post.calledWith('/login', {
          username: 'jimmy',
          password: 'CrakzKorn'
        })).to.be.true;
      });

      it('Resolves True and Sets Current User if login succeeds', function(done) {
        serviceUnderTest.authenticateUser('jimmy', 'CrakzKorn').then(function(result) {
          expect(result).to.be.true;
          expect(mockIdentity.currentUser.firstName).to.equal('James');
          expect(mockIdentity.currentUser.lastName).to.equal('Jones');
          done();
        });
        dfd.resolve({
          data: {
            success: true,
            user: {
              firstName: 'James',
              lastName: 'Jones'
            },
            token: 'IAmToken'
          }
        });
        scope.$apply();
      });

      it('saves the login token on success', function() {
        serviceUnderTest.authenticateUser('jimmy', 'CrakzKorn');
        dfd.resolve({
          data: {
            success: true,
            user: {
              firstName: 'James',
              lastName: 'Jones'
            },
            token: 'IAmToken'
          }
        });
        scope.$apply();
        expect(mockAuthToken.set.calledOnce).to.be.true;
        expect(mockAuthToken.set.calledWith('IAmToken')).to.be.true;
      });

      it('Resolves False and does not set Current User if login fails', function(done) {
        serviceUnderTest.authenticateUser('jimmy', 'CrakzKorn').then(function(result) {
          expect(result).to.be.false;
          expect(mockIdentity.currentUser).to.be.undefined;
          done();
        });
        dfd.resolve({
          data: {
            success: false,
            user: {
              firstName: 'James',
              lastName: 'Jones'
            }
          }
        });
        scope.$apply();
      });

      it('clears any existing login token if the login fails', function() {
        serviceUnderTest.authenticateUser('jimmy', 'CrakzKorn');
        dfd.resolve({
          data: {
            success: false,
            user: {
              firstName: 'James',
              lastName: 'Jones'
            }
          }
        });
        scope.$apply();
        expect(mockAuthToken.clear.calledOnce).to.be.true;
      });
    });

    describe('logoutUser', function() {
      it('clears the auth token', function() {
        serviceUnderTest.logoutUser();
        expect(mockAuthToken.clear.calledOnce).to.be.true;
      });

      it('Returns a promise', function() {
        var p = serviceUnderTest.logoutUser();
        expect(p.then).to.be.a('function');
      });

      it('posts to the logout endpoint', function() {
        serviceUnderTest.logoutUser();
        expect(mockHttp.post.calledWith('/logout', {
          logout: true
        })).to.be.true;
      });

      it('Clears the current user when logout complete', function(done) {
        mockIdentity.currentUser = {
          firstName: 'James',
          lastName: 'Jones'
        };
        serviceUnderTest.logoutUser().then(function() {
          expect(mockIdentity.currentUser).to.be.undefined;
          done();
        });
        dfd.resolve();
        scope.$apply();
      });
    });

    describe('currentUserAuthorizedForRole', function() {
      it('returns a rejected promise if the user is not logged in', function(done) {
        mockIdentity.isAuthenticated.returns(false);
        mockIdentity.isAuthorized.returns(false);
        serviceUnderTest.currentUserAuthorizedForRole('someRole')
          .then(function(data) {
          }, function(msg) {
            expect(msg).to.equal('Not Logged In');
            done();
          });
        scope.$apply();
      });

      it('returns a rejected promise if the user is not authorized for role', function(done) {
        mockIdentity.isAuthenticated.returns(true);
        mockIdentity.isAuthorized.returns(false);
        serviceUnderTest.currentUserAuthorizedForRole('someRole')
          .then(function(data) {
          }, function(msg) {
            expect(msg).to.equal('Not Authorized');
            done();
          });
        expect(mockIdentity.isAuthorized.calledWith('someRole')).to.be.true;
        scope.$apply();
      });

      it('returns true if user is athenticated and authorized for role', function() {
        mockIdentity.isAuthenticated.returns(true);
        mockIdentity.isAuthorized.returns(true);
        var result = serviceUnderTest.currentUserAuthorizedForRole('someRole');
        expect(result).to.be.true;
        expect(mockIdentity.isAuthorized.calledWith('someRole')).to.be.true;
      });

      it('does not check authorization if there is no role', function() {
        mockIdentity.isAuthenticated.returns(true);
        var result = serviceUnderTest.currentUserAuthorizedForRole('');
        expect(result).to.be.true;
        expect(mockIdentity.isAuthorized.called).to.be.false;
      });
    });
  });
}());