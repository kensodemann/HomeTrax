/* global beforeEach describe expect inject it sinon */
(function() {
  'use strict';

  describe('users', function() {
    var mockUser;

    var serviceUnderTest;

    beforeEach(module('app.account'));

    beforeEach(buildMocks);
    beforeEach(provideMocks);

    beforeEach(inject(function(users) {
      serviceUnderTest = users;
    }));

    function buildMocks() {
      mockUser = sinon.stub({
        query: function() {}
      });
    }

    function provideMocks() {
      module(function($provide) {
        $provide.value('User', mockUser);
      });
    }

    it('exists', function() {
      expect(serviceUnderTest).to.not.be.undefined;
    });

    describe('initiation', function() {
      it('queriues all of the users', function() {
        expect(mockUser.query.calledOnce).to.be.true;
      });
    });
  });
})();