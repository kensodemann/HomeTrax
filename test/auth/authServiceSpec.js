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
      var mockConfig = {
        dataService: 'http://something'
      };

      module(function($provide) {
        $provide.value('$http', mockHttp);
        $provide.value('identity', mockIdentity);
        $provide.value('User', mockUser);
        $provide.value('authToken', mockAuthToken);
        $provide.value('config', mockConfig);
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
        expect(mockHttp.post.calledWith('http://something/login', {
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
        expect(mockHttp.post.calledWith('http://something/logout', {
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
  });
}());