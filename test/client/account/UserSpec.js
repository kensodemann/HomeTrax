/* global beforeEach describe expect inject it sinon */
(function() {
  'use strict';

  describe('User', function() {
    var httpBackend;
    var serviceUnderTest;
    var scope;
    var testData;

    beforeEach(function() {
      testData = [{
        UserId: "1",
        TestTag: 1
      }, {
        UserId: "2",
        TestTag: 2
      }, {
        UserId: "3",
        TestTag: 4
      }, {
        UserId: "4",
        TestTag: 5
      }, {
        UserId: "5",
        TestTag: 7
      }];
    });

    beforeEach(module('app.account'));

    beforeEach(inject(function($rootScope, $httpBackend, User) {
      scope = $rootScope;
      httpBackend = $httpBackend;
      serviceUnderTest = User;
    }));

    it('exists', function() {
      expect(serviceUnderTest).to.not.be.undefined;
    });

    describe('query', function() {
      it('gets the data', function() {
        httpBackend.expectGET('/api/users')
          .respond(testData);
        var res = serviceUnderTest.query({});
        httpBackend.flush();

        expect(res.length).to.equal(5);
        expect(res[0].TestTag).to.equal(1);
        expect(res[2].TestTag).to.equal(4);
        expect(res[4].TestTag).to.equal(7);
      });
    });
  });
}());