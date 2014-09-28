'use strict';

describe('calendarData', function() {
  var mockCalendarEvent;
  var mockIdentity;
  var scope;
  var serviceUnderTest;

  beforeEach(module('app'));

  beforeEach(function() {
    mockCalendarEvent = sinon.stub({
      query: function() {
      }
    });
    mockIdentity = sinon.stub({});

    module(function($provide) {
      $provide.value('CalendarEvent', mockCalendarEvent);
      $provide.value('identity', mockIdentity);
    });
  });

  beforeEach(inject(function($rootScope, calendarData) {
    scope = $rootScope;
    serviceUnderTest = calendarData;
  }));

  it('exists', function() {
    expect(serviceUnderTest).to.not.be.undefined;
  });

  describe('Loading the data', function() {
    it('queries the calendarEvent resource', function() {
      serviceUnderTest.load();
      expect(mockCalendarEvent.query.calledOnce).to.be.true;
    });

    it('resolves true if the query returns successfully', function(done) {
      serviceUnderTest.load().then(function(res) {
        expect(res).to.be.true;
        done();
      });
      mockCalendarEvent.query.callArg(1);
      scope.$digest();
    });

    it('resolves true if the query returns successfully', function(done) {
      serviceUnderTest.load().then(function(res) {
        expect(res).to.be.false;
        done();
      });
      mockCalendarEvent.query.callArg(2);
      scope.$digest();
    });
  });

  describe('Filtering the data', function() {
    beforeEach(function() {
      setupQueryData();
      setupIdentity();
      serviceUnderTest.load();
    });

    describe('events excluded by the filter', function() {
      it('returns zero events if no filters are set', function() {
        serviceUnderTest.load();
        var evts = serviceUnderTest.excludedEvents();
        expect(evts.length).to.equal(0);
      });

      it("returns all other people's events when limitToMine filter set", function() {
        serviceUnderTest.load();
        serviceUnderTest.limitToMine(true);
        var evts = serviceUnderTest.excludedEvents();
        expect(evts.length).to.equal(4);
        angular.forEach(evts, function(evt) {
          expect(evt.UserId).to.not.equal(42);
        });
      });

      it('returns items of categories filtered out', function() {
        serviceUnderTest.load();
        serviceUnderTest.excludeCategory('Test');
        serviceUnderTest.excludeCategory('Health');
        var evts = serviceUnderTest.excludedEvents();
        expect(evts.length).to.equal(5);
        angular.forEach(evts, function(evt) {
          expect(evt.category === 'Test' || evt.category === 'Health').to.be.true;
        });
      });

      it('no longer returns items of categories where the filter has been cleared', function() {
        serviceUnderTest.load();
        serviceUnderTest.excludeCategory('Test');
        serviceUnderTest.excludeCategory('Health');
        serviceUnderTest.includeCategory('Test');
        var evts = serviceUnderTest.excludedEvents();
        expect(evts.length).to.equal(1);
        angular.forEach(evts, function(evt) {
          expect(evt.category === 'Health').to.be.true;
        });
      });

      it('returns the proper stuff when both category and user filters are applied', function() {
        serviceUnderTest.load();
        serviceUnderTest.excludeCategory('Test');
        serviceUnderTest.limitToMine(true);
        var evts = serviceUnderTest.excludedEvents();
        expect(evts.length).to.equal(7);
        angular.forEach(evts, function(evt) {
          expect(evt.userId !== 42 || evt.category === 'Test').to.be.true;
          if (evt.userId === 42) {
            expect(evt.category).to.equal('Test');
          }
          if (evt.category !== 'Test') {
            expect(evt.userId).to.not.equal(42);
          }
        });
      });
    });

    describe('filtered events', function() {
      it('returns all events if no filters are set', function() {
        serviceUnderTest.load();
        var evts = serviceUnderTest.events();
        expect(evts.length).to.equal(10);
      });

      it("returns only my events when limitToMine filter set", function() {
        serviceUnderTest.load();
        serviceUnderTest.limitToMine(true);
        var evts = serviceUnderTest.events();
        expect(evts.length).to.equal(6);
        angular.forEach(evts, function(evt) {
          expect(evt.userId).to.equal(42);
        });
      });

      it('does not return items of categories filtered out', function() {
        serviceUnderTest.load();
        serviceUnderTest.excludeCategory('Test');
        serviceUnderTest.excludeCategory('Health');
        var evts = serviceUnderTest.events();
        expect(evts.length).to.equal(5);
        angular.forEach(evts, function(evt) {
          expect(evt.category !== 'Test' || evt.category !== 'Health').to.be.true;
        });
      });

      it('does return items of categories after filtering is cleared', function() {
        serviceUnderTest.load();
        serviceUnderTest.excludeCategory('Test');
        serviceUnderTest.excludeCategory('Health');
        serviceUnderTest.includeCategory('Test');
        var evts = serviceUnderTest.events();
        expect(evts.length).to.equal(9);
        angular.forEach(evts, function(evt) {
          expect(evt.category).to.not.equal('Health');
        });
      });

      it('returns the proper stuff when both category and user filters are applied', function() {
        serviceUnderTest.load();
        serviceUnderTest.excludeCategory('Test');
        serviceUnderTest.limitToMine(true);
        var evts = serviceUnderTest.events();
        expect(evts.length).to.equal(3);
        angular.forEach(evts, function(evt) {
          expect(evt.category).to.not.equal('Test');
          expect(evt.userId).to.equal(42);
        });
      });
    });

    function setupIdentity() {
      mockIdentity.currentUser = {
        _id: 42,
        firstName: 'Ultimate',
        lastName: 'Answer'
      };
    }

    function setupQueryData() {
      mockCalendarEvent.query.returns([
        {
          _id: 1,
          name: 'first event',
          category: 'Test',
          userId: 42
        },
        {
          _id: 2,
          name: 'second event',
          category: 'Health',
          userId: 42
        },
        {
          _id: 3,
          name: 'third event',
          category: 'Test',
          userId: 73
        },
        {
          _id: 4,
          name: 'forth event',
          category: 'Appointment',
          userId: 42
        },
        {
          _id: 5,
          name: 'fifth event',
          category: 'Appointment',
          userId: 69
        },
        {
          _id: 6,
          name: 'sixth event',
          category: 'Test',
          userId: 42
        },
        {
          _id: 7,
          name: 'seventh event',
          category: 'Personal',
          userId: 81
        },
        {
          _id: 8,
          name: 'eighth event',
          category: 'Personal',
          userId: 42
        },
        {
          _id: 9,
          name: 'ninth event',
          category: 'Recreation',
          userId: 69
        },
        {
          _id: 10,
          name: 'tenth event',
          category: 'Test',
          userId: 42
        }
      ]);
    }
  });
});