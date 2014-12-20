(function() {
  'use strict';

  describe('authService', function() {
    var mockHttp;
    var mockIdentity;
    var dfd;
    var serviceUnderTest;
    var scope;

    beforeEach(module('app.account'));

    beforeEach(function() {
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

      module(function($provide) {
        $provide.value('$http', mockHttp);
        $provide.value('identity', mockIdentity);
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
            }
          }
        });
        scope.$apply();
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
    });

    describe('logoutUser', function() {
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

    describe('currentUserAuthorizedForRoute', function() {
      it('returns a rejected promise if the user is not logged in', function(done) {
        mockIdentity.isAuthenticated.returns(false);
        mockIdentity.isAuthorized.returns(false);
        serviceUnderTest.currentUserAuthorizedForRoute('someRole')
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
        serviceUnderTest.currentUserAuthorizedForRoute('someRole')
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
        var result = serviceUnderTest.currentUserAuthorizedForRoute('someRole');
        expect(result).to.be.true;
        expect(mockIdentity.isAuthorized.calledWith('someRole')).to.be.true;
      });

      it('does not check authorization if there is no role', function() {
        mockIdentity.isAuthenticated.returns(true);
        var result = serviceUnderTest.currentUserAuthorizedForRoute('');
        expect(result).to.be.true;
        expect(mockIdentity.isAuthorized.called).to.be.false;
      });
    });
  });
}());