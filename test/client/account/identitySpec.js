/* global beforeEach describe expect inject it sinon */
(function() {
  'use strict';

  describe('identity', function() {
    var serviceUnderTest;

    var mockUserConstructor;
    var mockWindow;

    beforeEach(module('app.account'));

    beforeEach(function() {
      buildMockUser();
      buildMockWindow();

      module(function($provide) {
        $provide.value('User', mockUserConstructor);
        $provide.value('$window', mockWindow);
      });

      function buildMockUser() {
        mockUserConstructor = sinon.stub().returns({});
      }

      function buildMockWindow() {
        mockWindow = {
          bootstrappedUserObject: {
            _id: 42,
            firstName: 'Bill',
            lastName: 'Jackson',
            roles: ['user', 'talker']
          }
        };
      }
    });

    beforeEach(inject(function(identity) {
      serviceUnderTest = identity;
    }));

    describe('instantiation', function() {
      it('sets the current user if there is one', function() {
        expect(mockUserConstructor.calledOnce).to.be.true;
        expect(serviceUnderTest.currentUser.firstName).to.equal('Bill');
        expect(serviceUnderTest.currentUser.lastName).to.equal('Jackson');
        expect(serviceUnderTest.currentUser.roles).to.deep.equal(['user', 'talker']);
      });
    });

    describe('isAuthenticated', function() {
      it('returns false if there is no user', function() {
        serviceUnderTest.currentUser = undefined;
        expect(serviceUnderTest.isAuthenticated()).to.be.false;
      });

      it('returns true if there is a user', function() {
        expect(serviceUnderTest.isAuthenticated()).to.be.true;
      });
    });

    describe('isAuthorized', function() {
      it('returns false if there is no user', function() {
        serviceUnderTest.currentUser = undefined;
        expect(serviceUnderTest.isAuthorized('')).to.be.false;
      });

      it('returns false if there is a user, but user does not have role', function() {
        serviceUnderTest.currentUser = {
          _id: 'something',
          roles: ['user', 'cook']
        };
        expect(serviceUnderTest.isAuthorized('admin')).to.be.false;
      });

      it('returns true if there is a user, and user does have role', function() {
        serviceUnderTest.currentUser = {
          _id: 'something',
          roles: ['user', 'cook', 'admin']
        };
        expect(serviceUnderTest.isAuthorized('admin')).to.be.true;
      });

      it('returns true if there is a user, and no role is required', function() {
        serviceUnderTest.currentUser = {
          _id: 'something',
          roles: ['user', 'cook', 'admin']
        };
        expect(serviceUnderTest.isAuthorized('')).to.be.true;
        expect(serviceUnderTest.isAuthorized()).to.be.true;
      });

      it('returns false if a role is required but the user does not have any roles', function() {
        serviceUnderTest.currentUser = {
          _id: 'something'
        };
        expect(serviceUnderTest.isAuthorized('admin')).to.be.false;
      });

      it('returns true if a role is not required and the user does not have any roles', function() {
        serviceUnderTest.currentUser = {
          _id: 'something'
        };
        expect(serviceUnderTest.isAuthorized('')).to.be.true;
        expect(serviceUnderTest.isAuthorized()).to.be.true;
      });
    });
  });
}());