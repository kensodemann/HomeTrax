/*jshint expr: true*/
(function() {
  'use strict';

  describe('Household', function() {
    var httpBackend;
    var serviceUnderTest;
    var scope;
    var testData;

    beforeEach(module('app.household'));

    beforeEach(function() {
      testData = [{
        _id: 1,
        name: 'Fred',
        testTag: 42
      },{
        _id: 2,
        name: 'Bob',
        testTag: 73
      },{
        _id: 3,
        name: 'Jack',
        testTag: 314159
      }];
    });

    beforeEach(inject(function($rootScope, $httpBackend, Household) {
      scope = $rootScope;
      httpBackend = $httpBackend;
      serviceUnderTest = Household;
    }));

    it('Should exist', function() {
      expect(serviceUnderTest).to.not.be.undefined;
    });

    describe('query', function() {
      it('gets the data', function() {
        httpBackend.expectGET('/api/households')
          .respond(testData);
        var res = serviceUnderTest.query({});
        httpBackend.flush();

        expect(res.length).to.equal(3);
        expect(res[0].testTag).to.equal(42);
        expect(res[1].testTag).to.equal(73);
        expect(res[2].testTag).to.equal(314159);
      });
    });

    describe('post', function() {
      it('posts the data using the _id', function() {
        httpBackend.expectGET('/api/households')
          .respond(testData);
        var res = serviceUnderTest.query({});
        httpBackend.flush();

        httpBackend.expectPOST('/api/households/2').respond(res[1]);
        res[1].$save();
        httpBackend.flush();
      });
    });
  });
}());
  
  