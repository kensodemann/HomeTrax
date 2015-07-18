/*jshint expr: true*/
(function() {
  'use strict';

  describe('Entity', function() {
    var httpBackend;
    var HomeAppEvent;
    var scope;
    var testData;
    var config;

    beforeEach(module('app.core'));

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(inject(function($rootScope, $httpBackend, _HomeAppEvent_, _config_) {
      scope = $rootScope;
      httpBackend = $httpBackend;
      HomeAppEvent = _HomeAppEvent_;
      config = _config_;
    }));

    it('Exists', function() {
      expect(HomeAppEvent).to.exist;
    });

    describe('query', function() {
      it('gets all the data', function() {
        httpBackend.expectGET(config.dataService + '/events')
          .respond(testData);
        HomeAppEvent.query({});
        httpBackend.flush();
      });

      it('gets the specified event type', function() {
        httpBackend.expectGET(config.dataService + '/events?eventType=transaction')
          .respond(testData);
        HomeAppEvent.query({
          eventType: 'transaction'
        });
        httpBackend.flush();
      });

      describe('date adjustments', function() {
        var res;
        beforeEach(function() {
          httpBackend.expectGET(config.dataService + '/events')
            .respond(testData);
          res = HomeAppEvent.query({});
          httpBackend.flush();
        });

        it('adds the time zone offset to the transactionDate', function() {
          expect(res[0].transactionDate).to.deep.equal(new Date(2015, 0, 15));
          expect(res[1].transactionDate).to.deep.equal(new Date(2015, 2, 14));
          expect(res[2].transactionDate).to.be.undefined;
          expect(res[3].transactionDate).to.be.undefined;
          expect(res[4].transactionDate).to.deep.equal(new Date(2015, 3, 25));
        });
      });
    });

    describe('post', function() {
      var res;
      beforeEach(function() {
        httpBackend.expectGET(config.dataService + '/events')
          .respond(testData);
        res = HomeAppEvent.query({});
        httpBackend.flush();
      });

      it('posts the data using the _id', function() {
        httpBackend.expectPOST(config.dataService + '/events/73').respond(res[1]);
        res[1].$save();
        httpBackend.flush();
      });

      describe('date adjustments', function() {
        it('Removes the TZ from the transaction date', function() {
          res[0].transactionDate = new Date(2011, 6, 15);
          httpBackend.expectPOST(config.dataService + '/events/42', {
            _id: 42,
            description: 'Withdrawl #1',
            transactionDate: '2011-07-15T00:00:00.000Z',
            principalAmount: -123.04,
            interestAmount: 0,
            eventType: 'transaction'
          }).respond({});
          res[0].$save();
          httpBackend.flush();
        });

        it('adds the TZ to the tranaction date in the response', function(){
          httpBackend.expectPOST(config.dataService + '/events/42').respond({
            _id: 42,
            description: 'Withdrawl #1',
            transactionDate: '2015-01-15T00:00:00.000Z',
            principalAmount: -123.04,
            interestAmount: 0,
            eventType: 'transaction'
          });
          res[0].$save();
          httpBackend.flush();
          expect(res[0].transactionDate).to.deep.equal(new Date(2015, 0, 15));
        });
      });
    });

    function initializeTestData() {
      testData = [{
        _id: 42,
        description: 'Withdrawl #1',
        transactionDate: '2015-01-15T00:00:00.000Z',
        principalAmount: -123.04,
        interestAmount: 0,
        eventType: 'transaction'
      }, {
        _id: 73,
        description: 'Deposit #1',
        transactionDate: '2015-03-14T00:00:00.000Z',
        principalAmount: 7384.09,
        interestAmount: 0.05,
        eventType: 'transaction'
      }, {
        "_id": 320,
        "start": "2015-05-01T00:00:00.000Z",
        "end": "2015-05-02T00:00:00.000Z",
        "allDay": true,
        "title": "May Day",
        "category": "Holiday",
        "private": false,
        "color": "#006600",
        "eventType": "miscellaneous"
      }, {
        "_id": 531,
        "start": "2015-05-29T08:00:00.000Z",
        "end": "2015-05-30T14:30:00.000Z",
        "allDay": false,
        "title": "Synod Assembly",
        "category": "Church",
        "private": false,
        "color": "#006600",
        "eventType": "miscellaneous"
      }, {
        _id: 314159,
        description: 'Deposit #2',
        transactionDate: '2015-04-25T00:00:00.000Z',
        principalAmount: 1125.89,
        interestAmount: 0.09,
        eventType: 'transaction'
      }];
    }
  });
}());