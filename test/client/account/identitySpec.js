'use strict'

describe('identity', function() {
  beforeEach(module('app'));

  describe('isAuthenticated', function() {
    it('Should return false if there is no user', inject(function(identity) {
      identity.currentUser = null;
      expect(identity.isAuthenticated()).to.be.false;
    }));

    it('Should return true if there is a user', inject(function(identity) {
      identity.currentUser = {
      	id: 'something'
      };
      expect(identity.isAuthenticated()).to.be.true;
    }));
  });

  describe('isAuthorized', function() {
    it('Should return false if there is no user', inject(function(identity) {
      identity.currentUser = null;
      expect(identity.isAuthorized('admin')).to.be.false;
    }));

    it('Should return false if there is a user, but user does not have role', inject(function(identity) {
      identity.currentUser = {
      	id: 'something',
      	roles: ['user', 'cook']
      };
      expect(identity.isAuthorized('admin')).to.be.false;
    }));

    it('Should return true if there is a user, and user does have role', inject(function(identity) {
      identity.currentUser = {
      	id: 'something',
      	roles: ['user', 'cook', 'admin']
      };
      expect(identity.isAuthorized('admin')).to.be.true;
    }));
  });
})