(function() {
  'use strict';

  describe('calendarData', function() {
    var mockCalendarEvent;
    var mockEventCategory;
    var mockIdentity;
    var scope;
    var serviceUnderTest;

    beforeEach(module('app.calendar'));

    beforeEach(function() {
      mockCalendarEvent = sinon.stub().returns(Object);
      mockCalendarEvent.query = sinon.stub();
      mockEventCategory = sinon.stub({
        query: function() {
        }
      });
      mockIdentity = sinon.stub({});

      module(function($provide) {
        $provide.value('CalendarEvent', mockCalendarEvent);
        $provide.value('EventCategory', mockEventCategory);
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
      it('queries the CalendarEvent resource', function() {
        serviceUnderTest.load();
        expect(mockCalendarEvent.query.calledOnce).to.be.true;
      });

      it('queries the EventCategory resource', function() {
        serviceUnderTest.load();
        expect(mockEventCategory.query.calledOnce).to.be.true;
      });

      it('resolves true if all queries return successfully', function(done) {
        serviceUnderTest.load().then(function(res) {
          expect(res).to.be.true;
          done();
        });
        mockCalendarEvent.query.callArg(1);
        mockEventCategory.query.callArg(1);
        scope.$digest();
      });

      it('resolves false if the events query returns unsuccessfully', function(done) {
        serviceUnderTest.load().then(function(res) {
          expect(res).to.be.false;
          done();
        });
        mockCalendarEvent.query.callArg(2);
        mockEventCategory.query.callArg(1);
        scope.$digest();
      });

      it('resolves false if the event category query returns unsuccessfully', function(done) {
        serviceUnderTest.load().then(function(res) {
          expect(res).to.be.false;
          done();
        });
        mockCalendarEvent.query.callArg(1);
        mockEventCategory.query.callArg(2);
        scope.$digest();
      });
    });

    describe('Event Categories', function() {
      var cats;

      beforeEach(function() {
        cats = [
          {
            name: 'Test',
            _id: 1
          },
          {
            name: 'Appointments',
            _id: 2
          },
          {
            name: 'Health & Fitness',
            _id: 3
          }
        ];
        mockEventCategory.query.returns(cats);
      });

      it('returns the event categories', function() {
        loadCategories();
        var items = serviceUnderTest.eventCategories();
        expect(items.length).to.equal(3);
      });

      it('initializes include flag to true', function() {
        loadCategories();
        var items = serviceUnderTest.eventCategories();
        angular.forEach(items, function(item) {
          expect(item.include).to.be.true;
        });
      });

      it('sets the include flag based on excluded events', function() {
        serviceUnderTest.excludeCategory('Appointments');
        loadCategories();
        var items = serviceUnderTest.eventCategories();
        expect(items[0].include).to.be.true;
        expect(items[1].include).to.be.false;
        expect(items[2].include).to.be.true;
      });

      function loadCategories() {
        serviceUnderTest.load();
        mockCalendarEvent.query.callArg(1);
        mockEventCategory.query.callArgWith(1, cats);
      }
    });

    describe('Creating a new event', function() {
      it('creates an object', function() {
        var e = serviceUnderTest.newEvent(moment());
        expect(e).to.be.an('object');
      });

      it('sets the start time to 8:00am', function() {
        var now = moment();
        var expected = moment(now);
        expected.hour(8);

        var e = serviceUnderTest.newEvent(now);

        expect(e.start).to.deep.equal(expected);
      });

      it('sets the end time to 9:00am', function() {
        var now = moment();
        var expected = moment(now);
        expected.hour(9);

        var e = serviceUnderTest.newEvent(now);

        expect(e.end).to.deep.equal(expected);
      });

      it('sets allDay to false', function() {
        var now = moment();
        var expected = moment(now);
        expected.hour(9);

        var e = serviceUnderTest.newEvent(now);

        expect(e.allDay).to.be.false;
      });
    });

    describe('Filtering the data', function() {
      beforeEach(function() {
        setupQueryData();
        setupIdentity();
        serviceUnderTest.load();
      });

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
}());