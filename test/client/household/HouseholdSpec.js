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
        testTag: 42,
        purchaseDate: '2013-03-03T00:00:00.000Z'
      }, {
        _id: 2,
        name: 'Bob',
        testTag: 73
      }, {
        _id: 3,
        name: 'Jack',
        testTag: 314159,
        purchaseDate: '2014-07-28T00:00:00.000Z'
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
      var res;
      beforeEach(function() {
        httpBackend.expectGET('/api/households')
          .respond(testData);
        res = serviceUnderTest.query({});
        httpBackend.flush();
      });

      it('gets the data', function() {
        expect(res.length).to.equal(3);
        expect(res[0].testTag).to.equal(42);
        expect(res[1].testTag).to.equal(73);
        expect(res[2].testTag).to.equal(314159);
      });

      it('Transforms dates for the time zone', function() {
        expect(res[0].purchaseDate).to.deep.equal(new Date(2013, 2, 3));
        expect(res[1].purchaseDate).to.be.undefined;
        expect(res[2].purchaseDate).to.deep.equal(new Date(2014, 6, 28));
      });
    });

    describe('post', function() {
      var res;
      beforeEach(function() {
        httpBackend.expectGET('/api/households')
          .respond(testData);
        res = serviceUnderTest.query({});
        httpBackend.flush();
      });

      it('posts the data using the _id', function() {
        httpBackend.expectPOST('/api/households/2').respond(res[1]);
        res[1].$save();
        httpBackend.flush();
      });

      it('Adjusts the purchase date for TZ', function() {
        res[0].purchaseDate = new Date(2011, 6, 15);
        httpBackend.expectPOST('/api/households/1', {
          _id: 1,
          name: 'Fred',
          testTag: 42,
          purchaseDate: '2011-07-15T00:00:00.000Z'
        }).respond({
          _id: 1,
          name: 'Fred',
          testTag: 42,
          purchaseDate: '2011-07-15T00:00:00.000Z'
        });
        res[0].$save();
        httpBackend.flush();
      });

      it('Adjusts the purchase date in the response', function() {
        httpBackend.expectPOST('/api/households/1').respond({
          _id: 1,
          name: 'Fred',
          testTag: 42,
          purchaseDate: '2011-07-15T00:00:00.000Z'
        });
        res[0].$save();
        httpBackend.flush();
        expect(res[0].purchaseDate).to.deep.equal(new Date(2011, 6, 15));
      });
    });
  });
}());
  
  