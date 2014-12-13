'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var authentication = require('../../../server/services/authentication');
var encryption = require('../../../server/services/encryption');

describe('authentication', function() {

  describe('passwordIsValid', function() {
    var user = {
      salt: 'NaCl',
      hashedPassword: encryption.hash('NaCl', 'enteredPassword')
    };

    it('returns true if password correct', function() {
      expect(authentication.passwordIsValid(user, 'enteredPassword')).to.be.true;
    });

    it('returns false if password incorrect', function() {
      expect(authentication.passwordIsValid(user, 'someOtherPassword')).to.be.false;
    });
  });


  describe('requiresApiLogin', function() {
    var req;
    var res;
    var next;
    beforeEach(function() {
      req = sinon.stub({
        isAuthenticated: function() {}
      });
      res = sinon.stub({
        status: function() {},
        end: function() {}
      });
      next = sinon.spy();
    });

    it('Goes on to the next thing if authenticated', function() {
      req.isAuthenticated.returns(true);
      authentication.requiresApiLogin(req, res, next);
      expect(next.calledOnce).to.be.true;
      expect(res.status.called).to.be.false;
      expect(res.end.called).to.be.false;
    });

    it('Should set a status 403 if not authenticated', function() {
      req.isAuthenticated.returns(false);
      authentication.requiresApiLogin(req, res, next);
      expect(next.called).to.be.false;
      expect(res.status.calledWith(403)).to.be.true;
      expect(res.end.calledOnce).to.be.true;
    });
  });

  describe('requiresRole', function() {
    var req;
    var res;
    var next;
    beforeEach(function() {
      req = sinon.stub({
        isAuthenticated: function() {},
        user: {
          roles: ['rye', 'wheat']
        }
      });
      res = sinon.stub({
        status: function() {},
        end: function() {}
      });
      next = sinon.spy();
    });

    it('Should set a status 403 if not authenticated', function() {
      req.isAuthenticated.returns(false);
      authentication.requiresRole('rye')(req, res, next);
      expect(next.called).to.be.false;
      expect(res.status.calledWith(403)).to.be.true;
      expect(res.end.calledOnce).to.be.true;
    });

    it('Should set a status of 403 if not authorized', function() {
      req.isAuthenticated.returns(true);
      authentication.requiresRole('white')(req, res, next);
      expect(next.called).to.be.false;
      expect(res.status.calledWith(403)).to.be.true;
      expect(res.end.calledOnce).to.be.true;
    });

    it('Should move to the next thing if authenticated and authorized', function() {
      req.isAuthenticated.returns(true);
      authentication.requiresRole('rye')(req, res, next);
      expect(next.calledOnce).to.be.true;
      expect(res.status.called).to.be.false;
      expect(res.end.called).to.be.false;
    });
  });

  describe('requiresRoleOrIsCurrentUser', function() {
    var req;
    var res;
    var next;
    beforeEach(function() {
      req = sinon.stub({
        isAuthenticated: function() {},
        params: {
          id: 2
        },
        user: {
          _id: 1,
          roles: ['rye', 'wheat']
        }
      });
      res = sinon.stub({
        status: function() {},
        end: function() {}
      });
      next = sinon.spy();
    });

    it('Should set a status 403 if not authenticated', function() {
      req.isAuthenticated.returns(false);
      authentication.requiresRoleOrIsCurrentUser('rye')(req, res, next);
      expect(next.called).to.be.false;
      expect(res.status.calledWith(403)).to.be.true;
      expect(res.end.calledOnce).to.be.true;
    });

    it('Should set a status of 403 if not authorized and not current user', function() {
      req.isAuthenticated.returns(true);
      authentication.requiresRoleOrIsCurrentUser('white')(req, res, next);
      expect(next.called).to.be.false;
      expect(res.status.calledWith(403)).to.be.true;
      expect(res.end.calledOnce).to.be.true;
    });

    it('Should move to the next thing if authenticated and authorized but not current user', function() {
      req.isAuthenticated.returns(true);
      authentication.requiresRoleOrIsCurrentUser('rye')(req, res, next);
      expect(next.calledOnce).to.be.true;
      expect(res.status.called).to.be.false;
      expect(res.end.called).to.be.false;
    });

    it('Should move to the next thing if authenticated and not authorized but is current user', function() {
      req.isAuthenticated.returns(true);
      req.params.id = 1;
      authentication.requiresRoleOrIsCurrentUser('white')(req, res, next);
      expect(next.calledOnce).to.be.true;
      expect(res.status.called).to.be.false;
      expect(res.end.called).to.be.false;
    });
  });
});