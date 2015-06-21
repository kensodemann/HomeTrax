/* global beforeEach describe expect inject it sinon */
(function() {
  'use strict';

  describe('users', function() {
    var mockUser;
    var queryUsersDfd;
    var scope;
    var testData;

    var serviceUnderTest;

    beforeEach(module('app.userAdministration'));

    beforeEach(buildMocks);
    beforeEach(provideMocks);

    beforeEach(inject(function($rootScope, $q, users) {
      scope = $rootScope;
      serviceUnderTest = users;
      queryUsersDfd = $q.defer();
      testData.$promise = queryUsersDfd.promise;
    }));

    function buildMocks() {
      testData = [{
        _id: '42',
        firstName: 'Billy',
        lastName: 'Bathgate'
      }, {
        _id: '73',
        firstName: 'Owen',
        lastName: 'Meany'
      }];
      mockUser = sinon.stub({
        query: function() {},
        $save: function() {}
      });
      mockUser.query.returns(testData);
    }

    function provideMocks() {
      module(function($provide) {
        $provide.value('User', mockUser);
      });
    }

    it('exists', function() {
      expect(serviceUnderTest).to.not.be.undefined;
    });

    describe('instantiation', function() {
      it('queries all of the users', function() {
        expect(mockUser.query.calledOnce).to.be.true;
      });

      it('assigns the returned users to "all"', function() {
        expect(serviceUnderTest.all.length).to.equal(2);
        expect(serviceUnderTest.all[0]._id).to.equal('42');
        expect(serviceUnderTest.all[1]._id).to.equal('73');
      });
    });

    describe('get', function() {
      it('resolves to the matching user from cache', function(done) {
        serviceUnderTest.get('73').then(function(user) {
          expect(mockUser.query.calledOnce).to.be.true;
          expect(user._id).to.equal('73');
          expect(user.firstName).to.equal('Owen');
          expect(user.lastName).to.equal('Meany');
          done();
        });
        scope.$digest();
      });

      it('requeries the users if the user does not exist', function(done) {
        serviceUnderTest.get('71').then(function() {
          expect(mockUser.query.calledTwice).to.be.true;
          done();
        });
        queryUsersDfd.resolve();
        scope.$digest();
      });

      it('resolves to the matching user after requery', function(done) {
        var newTestData = [{
          _id: '42',
          firstName: 'Billy',
          lastName: 'Bathgate'
        }, {
          _id: '73',
          firstName: 'Owen',
          lastName: 'Meany'
        }, {
          _id: '71',
          firstName: 'Jimmy',
          lastName: 'Johns'
        }];
        newTestData.$promise = queryUsersDfd.promise;
        mockUser.query.returns(newTestData);
        serviceUnderTest.get('71').then(function(user) {
          expect(mockUser.query.calledTwice).to.be.true;
          expect(user).to.deep.equal({
            _id: '71',
            firstName: 'Jimmy',
            lastName: 'Johns'
          });
          done();
        });
        queryUsersDfd.resolve();
        scope.$digest();
      });

      it('resolves to undefined if there is no matching user after requery', function(done) {
        serviceUnderTest.get('71').then(function(user) {
          expect(user).to.be.undefined;
          done();
        });
        queryUsersDfd.resolve();
        scope.$digest();
      });
    });

    describe('add', function() {
      it('saves the passed user', function() {
        serviceUnderTest.add(mockUser);
        expect(mockUser.$save.calledOnce).to.be.true;
      });

      it('pushes the user if the save succeeds', function() {
        serviceUnderTest.add(mockUser);
        mockUser.$save.yield();
        expect(serviceUnderTest.all.length).to.equal(3);
      });

      it('calls first callback on success', function(done) {
        serviceUnderTest.add(mockUser, success, error);
        mockUser.$save.yield();

        function success() {
          done();
        }

        function error() {}
      });

      it('calls second callback on failure', function(done) {
        serviceUnderTest.add(mockUser, success, error);
        mockUser.$save.callArg(1);

        function success() {}

        function error() {
          done();
        }
      });
    });
  });
})();