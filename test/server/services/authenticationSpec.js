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

  });

});