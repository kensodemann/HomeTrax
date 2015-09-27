(function() {
  'use strict';

  describe('identity', function() {
    var config;
    var identity;
    var httpBackend;
    var mockAuthToken;
    var mockCacheBuster;

    beforeEach(module('homeTrax.auth'));

    beforeEach(function() {
      mockCacheBuster = {
        value: 'SomeBusterOfCache'
      };
    });

    beforeEach(function() {
      mockAuthToken = sinon.stub({
        get: function() {
        }
      });
    });

    beforeEach(function() {
      module(function($provide) {
        $provide.value('authToken', mockAuthToken);
        $provide.value('cacheBuster', mockCacheBuster);
      });
    });

    beforeEach(inject(function($httpBackend, _config_, _identity_) {
      config = _config_;
      identity = _identity_;
      httpBackend = $httpBackend;
    }));

    describe('instantiation', function() {
      it('queries the API for the current user', function() {
        httpBackend.expectGET(config.dataService + '/currentUser?_=SomeBusterOfCache').respond({});
        httpBackend.flush();
      });

      it('sets the current user to the ', function() {
        httpBackend.expectGET(config.dataService + '/currentUser?_=SomeBusterOfCache').respond({
          _id: 42,
          name: 'Ford Prefect'
        });
        httpBackend.flush();
        expect(identity.currentUser).to.deep.equal({
          _id: 42,
          name: 'Ford Prefect'
        });
      });
    });

    describe('isAuthenticated', function() {
      it('returns false if there is no token', function() {
        mockAuthToken.get.returns(null);
        expect(identity.isAuthenticated()).to.be.false;
      });

      it('returns true if there is a token', function() {
        mockAuthToken.get.returns('Something');
        expect(identity.isAuthenticated()).to.be.true;
      });
    });

    describe('isAuthorized', function() {
      it('returns false if there is no user', function() {
        mockAuthToken.get.returns(null);
        expect(identity.isAuthorized('')).to.be.false;
      });

      it('returns false if there is an authorized user, but user does not have role', function() {
        mockAuthToken.get.returns('Something');
        identity.currentUser = {
          _id: 'something',
          roles: ['user', 'cook']
        };
        expect(identity.isAuthorized('admin')).to.be.false;
      });

      it('returns true if there is an authorized user, and user does have role', function() {
        mockAuthToken.get.returns('Something');
        identity.currentUser = {
          _id: 'something',
          roles: ['user', 'cook', 'admin']
        };
        expect(identity.isAuthorized('admin')).to.be.true;
      });

      it('returns true if there is an authorized user, and no role is required', function() {
        mockAuthToken.get.returns('Something');
        identity.currentUser = {
          _id: 'something',
          roles: ['user', 'cook', 'admin']
        };
        expect(identity.isAuthorized('')).to.be.true;
        expect(identity.isAuthorized()).to.be.true;
      });

      it('returns false if a role is required but the user does not have any roles', function() {
        mockAuthToken.get.returns('Something');
        identity.currentUser = {
          _id: 'something'
        };
        expect(identity.isAuthorized('admin')).to.be.false;
      });

      it('returns true if a role is not required and the user does not have any roles', function() {
        mockAuthToken.get.returns('Something');
        identity.currentUser = {
          _id: 'something'
        };
        expect(identity.isAuthorized('')).to.be.true;
        expect(identity.isAuthorized()).to.be.true;
      });
    });
  });
}());