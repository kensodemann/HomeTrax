/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.auth.authInterceptor', function() {
    var authToken;
    var authInterceptor;

    beforeEach(module('homeTrax.auth.authInterceptor'));

    beforeEach(inject(function(_authInterceptor_, _authToken_) {
      authInterceptor = _authInterceptor_;
      authToken = _authToken_;
    }));

    it('exists', function() {
      expect(authInterceptor).to.exist;
    });

    describe('request', function() {
      beforeEach(function() {
        sinon.stub(authToken, 'get');
      });

      afterEach(function() {
        authToken.get.restore();
      });

      it('gets the login token', function() {
        authInterceptor.request({headers: {}});
        expect(authToken.get.calledOnce).to.be.true;
      });

      it('adds an Authentication header if a token exists', function() {
        authToken.get.returns('IAmToken');
        var req = authInterceptor.request({headers: {}});
        expect(req.headers.Authorization).to.equal('Bearer IAmToken');
      });

      it('does not add an Authentication header if a token does not exist', function() {
        authToken.get.returns('');
        var req = authInterceptor.request({headers: {}});
        expect(req.headers.Authorization).to.not.exist;
      });
    });
  });
}());
