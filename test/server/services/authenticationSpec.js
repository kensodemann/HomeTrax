var expect = require('chai').expect;
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

});