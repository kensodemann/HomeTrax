/* global beforeEach describe expect inject it sinon */
(function() {
  'use strict';

  describe('identity', function() {
    var identity;
    var httpBackend;
    var mockCacheBuster;

    beforeEach(module('app.auth'));

    beforeEach(function() {
      mockCacheBuster = {
        value: 'SomeBusterOfCache'
      };
      var mockConfig = {
        dataService: 'http://somedataservice'
      };

      module(function($provide) {
        $provide.value('cacheBuster', mockCacheBuster);
        $provide.value('config', mockConfig);
      });
    });

    beforeEach(inject(function($httpBackend, _identity_) {
      identity = _identity_;
      httpBackend = $httpBackend;
    }));

    describe('instantiation', function() {
      it('queries the API for the current user', function() {
        httpBackend.expectGET('http://somedataservice/api/currentUser?_=SomeBusterOfCache').respond({});
        httpBackend.flush();
      });

      it('sets the current user to the ', function() {
        httpBackend.expectGET('http://somedataservice/api/currentUser?_=SomeBusterOfCache').respond({
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
      it('returns false if there is no user', function() {
        identity.currentUser = undefined;
        expect(identity.isAuthenticated()).to.be.false;
      });

      it('returns true if there is a user', function() {
        identity.currentUser = {};
        expect(identity.isAuthenticated()).to.be.true;
      });
    });

    describe('isAuthorized', function() {
      it('returns false if there is no user', function() {
        identity.currentUser = undefined;
        expect(identity.isAuthorized('')).to.be.false;
      });

      it('returns false if there is a user, but user does not have role', function() {
        identity.currentUser = {
          _id: 'something',
          roles: ['user', 'cook']
        };
        expect(identity.isAuthorized('admin')).to.be.false;
      });

      it('returns true if there is a user, and user does have role', function() {
        identity.currentUser = {
          _id: 'something',
          roles: ['user', 'cook', 'admin']
        };
        expect(identity.isAuthorized('admin')).to.be.true;
      });

      it('returns true if there is a user, and no role is required', function() {
        identity.currentUser = {
          _id: 'something',
          roles: ['user', 'cook', 'admin']
        };
        expect(identity.isAuthorized('')).to.be.true;
        expect(identity.isAuthorized()).to.be.true;
      });

      it('returns false if a role is required but the user does not have any roles', function() {
        identity.currentUser = {
          _id: 'something'
        };
        expect(identity.isAuthorized('admin')).to.be.false;
      });

      it('returns true if a role is not required and the user does not have any roles', function() {
        identity.currentUser = {
          _id: 'something'
        };
        expect(identity.isAuthorized('')).to.be.true;
        expect(identity.isAuthorized()).to.be.true;
      });
    });
  });
}());