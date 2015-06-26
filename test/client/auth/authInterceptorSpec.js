(function() {
  'use strict';

  describe('authInterceptor', function() {
    var mockAuthToken;
    var authInterceptor;

    beforeEach(module('app.auth'));

    beforeEach(function() {
      mockAuthToken = sinon.stub({
        get: function() {}
      });

      module(function($provide) {
        $provide.value('authToken', mockAuthToken);
      });
    });

    beforeEach(inject(function(_authInterceptor_) {
      authInterceptor = _authInterceptor_;
    }));

    it('exists', function() {
      expect(authInterceptor).to.exist;
    });

    describe('request', function() {
      it('gets the login token', function() {
        authInterceptor.request({headers: {}});
        expect(mockAuthToken.get.calledOnce).to.be.true;
      });

      it('adds an Authentication header if a token exists', function() {
        mockAuthToken.get.returns('IAmToken');
        var req = authInterceptor.request({headers: {}});
        expect(req.headers.Authorization).to.equal('Bearer IAmToken');
      });

      it('does not add an Authentication header if a token does not exist', function() {
        mockAuthToken.get.returns('');
        var req = authInterceptor.request({headers: {}});
        expect(req.headers.Authorization).to.not.exist;
      });
    });
  });
}());