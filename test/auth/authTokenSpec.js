(function() {
  'use strict';

  describe('authToken', function() {
    var mockLocalStorageService;
    var authToken;

    beforeEach(module('app.auth'));

    beforeEach(function() {
      mockLocalStorageService = sinon.stub({
        get: function() {},

        set: function() {},

        remove: function() {}
      });

      module(function($provide) {
        $provide.value('localStorageService', mockLocalStorageService);
      });
    });

    beforeEach(inject(function(_authToken_) {
      authToken = _authToken_;
    }));

    it('exists', function() {
      expect(authToken).to.exist;
    });

    describe('setting the token', function() {
      it('sets the token in local storage', function() {
        authToken.set('IAmToken');
        expect(mockLocalStorageService.set.calledOnce).to.be.true;
        expect(mockLocalStorageService.set.calledWith('authToken', 'IAmToken')).to.be.true;
      });
    });

    describe('getting the token', function() {
      it('gets the token from local storage if it is not cached', function() {
        mockLocalStorageService.get.withArgs('authToken').returns('CheeseFilledButterFinger');
        expect(authToken.get()).to.equal('CheeseFilledButterFinger');
        expect(mockLocalStorageService.get.calledOnce).to.be.true;
        expect(mockLocalStorageService.get.calledWith('authToken')).to.be.true;
      });

      it('caches the value so it does not need to access local storage for subsequent calls', function() {
        mockLocalStorageService.get.withArgs('authToken').returns('CheeseFilledButterFinger');
        expect(authToken.get()).to.equal('CheeseFilledButterFinger');
        mockLocalStorageService.get.withArgs('authToken').returns('IAmDifferent');
        expect(authToken.get()).to.equal('CheeseFilledButterFinger');
        expect(mockLocalStorageService.get.calledOnce).to.be.true;
        expect(mockLocalStorageService.get.calledWith('authToken')).to.be.true;
      });

      it('returns the cached value if the value has been set in the current instance', function() {
        mockLocalStorageService.get.withArgs('authToken').returns('CheeseFilledButterFinger');
        authToken.set('IAmYetAnotherToken');
        expect(authToken.get()).to.equal('IAmYetAnotherToken');
        expect(mockLocalStorageService.get.called).to.be.false;
      });
    });

    describe('clearing the token', function() {
      it('removes the token from local storage', function() {
        authToken.clear();
        expect(mockLocalStorageService.remove.calledOnce).to.be.true;
        expect(mockLocalStorageService.remove.calledWith('authToken')).to.be.true;
      });

      it('clears the cache of the previously set token', function(){
        authToken.set('I Am Token');
        authToken.clear();
        var token = authToken.get();
        expect(token).to.not.exist;
      });
    });
  });
}());