/* global beforeEach describe expect inject it sinon */
(function() {
  'use strict';

  describe('identity', function() {
    var serviceUnderTest;

    var mockUser;
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
        mockUser = {};
        mockUserConstructor = sinon.stub().returns(mockUser);
      }

      function buildMockWindow() {
        mockWindow = {
          bootstrappedUserObject: {
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
      it('sets the current user', function(){
        expect(mockUserConstructor.calledOnce).to.be.true;
        expect(mockUser.firstName).to.equal('Bill');
        expect(mockUser.lastName).to.equal('Jackson');
        expect(mockUser.roles).to.deep.equal(['user', 'talker']);
      });
    });

    describe('isAuthenticated', function() {
      it('returns false if there is no user', function() {
        serviceUnderTest.currentUser = null;
        expect(serviceUnderTest.isAuthenticated()).to.be.false;
      });

      it('returns true if there is a user', function() {
        serviceUnderTest.currentUser = {
          id: 'something'
        };
        expect(serviceUnderTest.isAuthenticated()).to.be.true;
      });
    });

    describe('isAuthorized', function() {
      it('returns false if there is no user', function() {
        serviceUnderTest.currentUser = null;
        expect(serviceUnderTest.isAuthorized('admin')).to.be.false;
      });

      it('returns false if there is a user, but user does not have role', function() {
        serviceUnderTest.currentUser = {
          id: 'something',
          roles: ['user', 'cook']
        };
        expect(serviceUnderTest.isAuthorized('admin')).to.be.false;
      });

      it('returns true if there is a user, and user does have role', function() {
        serviceUnderTest.currentUser = {
          id: 'something',
          roles: ['user', 'cook', 'admin']
        };
        expect(serviceUnderTest.isAuthorized('admin')).to.be.true;
      });

      it('returns true if there is a user, and no role is required', function() {
        serviceUnderTest.currentUser = {
          id: 'something',
          roles: ['user', 'cook', 'admin']
        };
        expect(serviceUnderTest.isAuthorized('')).to.be.true;
        expect(serviceUnderTest.isAuthorized()).to.be.true;
      });

      it('returns false if a role is required but the user does not have any roles', function() {
        serviceUnderTest.currentUser = {
          id: 'something'
        };
        expect(serviceUnderTest.isAuthorized('admin')).to.be.false;
      });

      it('returns true if a role is not required and the user does not have any roles', function() {
        serviceUnderTest.currentUser = {
          id: 'something'
        };
        expect(serviceUnderTest.isAuthorized('')).to.be.true;
        expect(serviceUnderTest.isAuthorized()).to.be.true;
      });
    });
  });
}());