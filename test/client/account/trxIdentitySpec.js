describe('trxIdentity', function() {
  beforeEach(module('app'));

  describe('isAuthenticated', function() {
    it('Should return false if there is no user', inject(function(trxIdentity) {
      trxIdentity.currentUser = null;
      expect(trxIdentity.isAuthenticated()).to.be.false;
    }));

    it('Should return true if there is a user', inject(function(trxIdentity) {
      trxIdentity.currentUser = {
      	id: 'something'
      };
      expect(trxIdentity.isAuthenticated()).to.be.true;
    }));
  });

  describe('isAuthorized', function() {
    it('Should return false if there is no user', inject(function(trxIdentity) {
      trxIdentity.currentUser = null;
      expect(trxIdentity.isAuthorized('admin')).to.be.false;
    }));

    it('Should return false if there is a user, but user does not have role', inject(function(trxIdentity) {
      trxIdentity.currentUser = {
      	id: 'something',
      	roles: ['user', 'cook']
      };
      expect(trxIdentity.isAuthorized('admin')).to.be.false;
    }));

    it('Should return true if there is a user, and user does have role', inject(function(trxIdentity) {
      trxIdentity.currentUser = {
      	id: 'something',
      	roles: ['user', 'cook', 'admin']
      };
      expect(trxIdentity.isAuthorized('admin')).to.be.true;
    }));
  });
})