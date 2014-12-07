/*jshint expr: true*/
(function() {
  'use strict';

  describe('identity', function() {
    beforeEach(module('app.account'));

    describe('isAuthenticated', function() {
      it('returns false if there is no user', inject(function(identity) {
        identity.currentUser = null;
        expect(identity.isAuthenticated()).to.be.false;
      }));

      it('returns true if there is a user', inject(function(identity) {
        identity.currentUser = {
          id: 'something'
        };
        expect(identity.isAuthenticated()).to.be.true;
      }));
    });

    describe('isAuthorized', function() {
      it('returns false if there is no user', inject(function(identity) {
        identity.currentUser = null;
        expect(identity.isAuthorized('admin')).to.be.false;
      }));

      it('returns false if there is a user, but user does not have role', inject(function(identity) {
        identity.currentUser = {
          id: 'something',
          roles: ['user', 'cook']
        };
        expect(identity.isAuthorized('admin')).to.be.false;
      }));

      it('returns true if there is a user, and user does have role', inject(function(identity) {
        identity.currentUser = {
          id: 'something',
          roles: ['user', 'cook', 'admin']
        };
        expect(identity.isAuthorized('admin')).to.be.true;
      }));

      it('returns true if there is a user, and no role is required', inject(function(identity) {
        identity.currentUser = {
          id: 'something',
          roles: ['user', 'cook', 'admin']
        };
        expect(identity.isAuthorized('')).to.be.true;
        expect(identity.isAuthorized()).to.be.true;
      }));

      it('returns false if a role is required but the user does not have any roles', inject(function(identity) {
        identity.currentUser = {
          id: 'something'
        };
        expect(identity.isAuthorized('admin')).to.be.false;
      }));

      it('returns true if a role is not required and the user does not have any roles', inject(function(identity) {
        identity.currentUser = {
          id: 'something'
        };
        expect(identity.isAuthorized('')).to.be.true;
        expect(identity.isAuthorized()).to.be.true;
      }));
    });
  });
}());