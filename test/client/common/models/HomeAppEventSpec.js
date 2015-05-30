/*jshint expr: true*/
(function() {
  'use strict';

  describe('Entity', function() {
    var httpBackend;
    var HomeAppEvent;
    var scope;
    var testData;

    beforeEach(module('app.core'));

    beforeEach(function() {
      testData = [{
        _id: 42,
        description: 'Withdrawl #1',
        transactionDate: '2015-01-15',
        principalAmount: -123.04,
        interestAmount: 0,
        eventType: 'transaction'
      }, {
        _id: 73,
        description: 'Deposit #1',
        transactionDate: '2015-03-14',
        principalAmount: 7384.09,
        interestAmount: 0.05,
        eventType: 'transaction'
      }, {
        _id: 314159,
        description: 'Deposit #2',
        transactionDate: '2015-04-25',
        principalAmount: 1125.89,
        interestAmount: 0.09,
        eventType: 'transaction'
      }];
    });

    beforeEach(inject(function($rootScope, $httpBackend, _HomeAppEvent_) {
      scope = $rootScope;
      httpBackend = $httpBackend;
      HomeAppEvent = _HomeAppEvent_;
    }));

    it('Exists', function() {
      expect(HomeAppEvent).to.exist;
    });

    describe('query', function() {
      var res;
      beforeEach(function() {
        httpBackend.expectGET('/api/events')
          .respond(testData);
        res = HomeAppEvent.query({});
        httpBackend.flush();
      });

      it('gets the data', function() {
        expect(res.length).to.equal(3);
        expect(res[0]._id).to.equal(42);
        expect(res[1]._id).to.equal(73);
        expect(res[2]._id).to.equal(314159);
      });
    });

    describe('post', function() {
      var res;
      beforeEach(function() {
        httpBackend.expectGET('/api/events')
          .respond(testData);
        res = HomeAppEvent.query({});
        httpBackend.flush();
      });

      it('posts the data using the _id', function() {
        httpBackend.expectPOST('/api/events/73').respond(res[1]);
        res[1].$save();
        httpBackend.flush();
      });
    });
  });
}());